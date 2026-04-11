import { AuthService } from 'src/shared/model/AuthService.ts'
import type { ApiService } from 'src/shared/model/ApiService.ts'
import type { PermissionService, SystemPermissions } from 'src/shared/model/AbilityService'

const SESSION_COOKIE_NAME = 'rev_session'

function installDocumentCookie(initial = ''): { set(value: string): void } {
  let current = initial
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    writable: true,
    value: {
      get cookie() {
        return current
      },
      set cookie(value: string) {
        current = value
      },
    },
  })
  return {
    set(value: string) {
      current = value
    },
  }
}

function uninstallDocumentCookie(): void {
  // biome-ignore lint: explicit teardown
  delete (globalThis as { document?: unknown }).document
}

function makeApiService(getMe: jest.Mock): ApiService {
  return {
    client: { getMe },
    setToken: jest.fn(),
    setUnauthorizedHandler: jest.fn(),
  } as unknown as ApiService
}

function makePermissions(): { system: SystemPermissions; perm: PermissionService } {
  return {
    system: {
      setUserRole: jest.fn(),
      clearAll: jest.fn(),
    } as unknown as SystemPermissions,
    perm: {
      addOrganizationPermissions: jest.fn(),
    } as unknown as PermissionService,
  }
}

const ME_PAYLOAD = {
  me: {
    id: 'admin',
    username: 'admin',
    email: null,
    roleId: 'systemAdmin',
    role: null,
    organization: null,
  },
}

describe('AuthService', () => {
  let fetchMock: jest.Mock
  let cookieStore: { set(value: string): void }

  beforeEach(() => {
    cookieStore = installDocumentCookie('')

    fetchMock = jest.fn()
    Object.defineProperty(globalThis, 'fetch', {
      value: fetchMock,
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    uninstallDocumentCookie()
    jest.clearAllMocks()
  })

  describe('initialize() — anonymous visitor (no rev_session cookie)', () => {
    it('does NOT call getMe when document.cookie is empty', async () => {
      const getMe = jest.fn().mockResolvedValue(ME_PAYLOAD)
      const api = makeApiService(getMe)
      const { system, perm } = makePermissions()

      const service = new AuthService(api, system, perm)
      await service.initialize()

      expect(getMe).not.toHaveBeenCalled()
      expect(fetchMock).not.toHaveBeenCalled()
      expect(service.user).toBeNull()
      expect(service.isLoaded).toBe(true)
    })

    it('does NOT call getMe when only unrelated cookies are present', async () => {
      cookieStore.set('analytics=abc123; theme=dark')
      const getMe = jest.fn()
      const api = makeApiService(getMe)
      const { system, perm } = makePermissions()

      const service = new AuthService(api, system, perm)
      await service.initialize()

      expect(getMe).not.toHaveBeenCalled()
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('initialize() — returning visitor (rev_session=1 cookie present)', () => {
    beforeEach(() => {
      cookieStore.set(`${SESSION_COOKIE_NAME}=1`)
    })

    it('calls getMe and loads user on success', async () => {
      const getMe = jest.fn().mockResolvedValue(ME_PAYLOAD)
      const api = makeApiService(getMe)
      const { system, perm } = makePermissions()

      const service = new AuthService(api, system, perm)
      await service.initialize()

      expect(getMe).toHaveBeenCalledTimes(1)
      expect(service.user).toEqual(ME_PAYLOAD.me)
      expect(service.isLoaded).toBe(true)
    })

    it('detects rev_session when mixed with other cookies', async () => {
      cookieStore.set(`analytics=abc; ${SESSION_COOKIE_NAME}=1; theme=dark`)
      const getMe = jest.fn().mockResolvedValue(ME_PAYLOAD)
      const api = makeApiService(getMe)
      const { system, perm } = makePermissions()

      const service = new AuthService(api, system, perm)
      await service.initialize()

      expect(getMe).toHaveBeenCalledTimes(1)
      expect(service.user).toEqual(ME_PAYLOAD.me)
    })

    it('calls refresh then retries getMe on 401', async () => {
      const getMe = jest.fn().mockRejectedValueOnce(new Error('Unauthorized')).mockResolvedValueOnce(ME_PAYLOAD)
      const api = makeApiService(getMe)
      const { system, perm } = makePermissions()
      fetchMock.mockResolvedValue({ ok: true } as Response)

      const service = new AuthService(api, system, perm)
      await service.initialize()

      expect(getMe).toHaveBeenCalledTimes(2)
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      expect(service.user).toEqual(ME_PAYLOAD.me)
    })

    it('stays anonymous when refresh fails and leaves cleanup to the server response', async () => {
      const getMe = jest.fn().mockRejectedValue(new Error('Unauthorized'))
      const api = makeApiService(getMe)
      const { system, perm } = makePermissions()
      fetchMock.mockResolvedValue({ ok: false } as Response)

      const service = new AuthService(api, system, perm)
      await service.initialize()

      expect(service.user).toBeNull()
      expect(service.isLoaded).toBe(true)
    })
  })

  describe('afterLogin()', () => {
    it('calls fetchMe and records the in-memory token', async () => {
      const getMe = jest.fn().mockResolvedValue(ME_PAYLOAD)
      const api = makeApiService(getMe)
      const { system, perm } = makePermissions()

      const service = new AuthService(api, system, perm)
      await service.afterLogin('jwt-value')

      expect(service.user).toEqual(ME_PAYLOAD.me)
      expect(service.token).toBe('jwt-value')
      // No localStorage writes — rev_session comes from the login response.
      expect(getMe).toHaveBeenCalledTimes(1)
    })
  })

  describe('logout()', () => {
    it('awaits the server request before resolving, clears user and token', async () => {
      cookieStore.set(`${SESSION_COOKIE_NAME}=1`)

      let logoutResolved = false
      fetchMock.mockImplementation(
        () =>
          new Promise<Response>((resolve) => {
            setTimeout(() => {
              logoutResolved = true
              resolve({ ok: true, status: 204 } as Response)
            }, 20)
          }),
      )

      const getMe = jest.fn().mockResolvedValue(ME_PAYLOAD)
      const api = makeApiService(getMe)
      const { system, perm } = makePermissions()

      const service = new AuthService(api, system, perm)
      await service.afterLogin('jwt-value')
      expect(service.user).not.toBeNull()
      expect(logoutResolved).toBe(false)

      // Regression guard: the promise returned by logout() must NOT resolve
      // before the server call finishes. LogoutPage relies on this await to
      // avoid a race with checkGuest bouncing the user back to /.
      await service.logout()

      expect(logoutResolved).toBe(true)
      expect(fetchMock).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      expect(service.user).toBeNull()
      expect(service.token).toBeNull()
    })

    it('still clears local state when the server call fails', async () => {
      fetchMock.mockRejectedValue(new Error('network down'))

      const getMe = jest.fn().mockResolvedValue(ME_PAYLOAD)
      const api = makeApiService(getMe)
      const { system, perm } = makePermissions()

      const service = new AuthService(api, system, perm)
      await service.afterLogin('jwt-value')

      await service.logout()

      expect(service.user).toBeNull()
      expect(service.token).toBeNull()
    })
  })
})
