import { AuthorizePageViewModel } from './AuthorizePageViewModel.ts'

describe('AuthorizePageViewModel', () => {
  const originalWindow = (globalThis as { window?: unknown }).window
  const originalFetch = globalThis.fetch
  let activeModel: AuthorizePageViewModel | null = null

  beforeEach(() => {
    jest.useFakeTimers()
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        location: {
          search:
            '?client_id=client-1&client_name=Codex&redirect_uri=http%3A%2F%2F127.0.0.1%3A56608%2Fcallback&code_challenge=challenge-1&state=state-1&scope=mcp',
          href: 'http://localhost:5173/authorize',
        },
      },
    })
  })

  afterEach(() => {
    activeModel?.dispose()
    activeModel = null
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    if (originalWindow === undefined) {
      delete (globalThis as { window?: unknown }).window
    } else {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: originalWindow,
      })
    }
    globalThis.fetch = originalFetch
    jest.clearAllMocks()
  })

  it('uses issueAccessToken when the session exists but the in-memory token is missing', async () => {
    const setInMemoryToken = jest.fn()
    const authService = {
      token: null,
      setInMemoryToken,
    }
    const issueAccessToken = jest.fn().mockResolvedValue({
      issueAccessToken: { accessToken: 'jwt-from-session' },
    })
    const apiService = {
      client: { issueAccessToken },
    }
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        redirect_uri: 'http://127.0.0.1:56608/callback?code=auth_123&state=state-1',
      }),
    } as Response)
    globalThis.fetch = fetchMock

    const model = new AuthorizePageViewModel(
      authService as never,
      apiService as never,
    )
    activeModel = model

    model.init()
    await model.approve()

    expect(issueAccessToken).toHaveBeenCalledTimes(1)
    expect(setInMemoryToken).toHaveBeenCalledWith('jwt-from-session')
    expect(fetchMock).toHaveBeenCalledWith(
      '/oauth/authorize',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-from-session',
        }),
      }),
    )
    expect(model.authorizeError).toBeNull()
    expect(model.isAuthorized).toBe(true)
  })

  it('shows the existing sign-in error when issueAccessToken fails', async () => {
    const fetchMock = jest.fn()
    globalThis.fetch = fetchMock
    const authService = {
      token: null,
      setInMemoryToken: jest.fn(),
    }
    const apiService = {
      client: {
        issueAccessToken: jest.fn().mockRejectedValue(new Error('Unauthorized')),
      },
    }

    const model = new AuthorizePageViewModel(
      authService as never,
      apiService as never,
    )
    activeModel = model

    model.init()
    await model.approve()

    expect(model.authorizeError).toBe('Please sign in to authorize')
    expect(model.isAuthorized).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
