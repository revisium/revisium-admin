import { makeAutoObservable, runInAction } from 'mobx'
import { UserFragment } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { PermissionService, SystemPermissions } from 'src/shared/model/AbilityService'
import { ApiService } from 'src/shared/model/ApiService.ts'

const REFRESH_URL = '/api/auth/refresh'
const LOGOUT_URL = '/api/auth/logout'

// Presence cookie set by revisium-core alongside the httpOnly `rev_at` /
// `rev_rt` credentials. Its value is always "1" and it is NOT httpOnly, so
// this SPA can read it via `document.cookie` to decide whether to attempt
// getMe on page load. Carries no credential. See ADR-0045.
const SESSION_COOKIE_NAME = 'rev_session'

export class AuthService {
  public isLoaded = false

  public user: UserFragment | null = null

  public token: string | null = null

  private refreshPromise: Promise<boolean> | null = null

  constructor(
    private readonly apiService: ApiService,
    private readonly systemPermissions: SystemPermissions,
    private readonly permissionService: PermissionService,
  ) {
    makeAutoObservable(this)
    this.apiService.setUnauthorizedHandler(() => this.tryRefresh())
  }

  public async initialize(): Promise<void> {
    // Skip the fetchMe dance entirely for visitors with no prior session —
    // the server-set rev_session cookie is the presence indicator.
    if (!AuthService.hasSessionCookie()) {
      runInAction(() => {
        this.isLoaded = true
      })
      return
    }

    try {
      await this.fetchMe()
    } catch {
      const refreshed = await this.tryRefresh()
      if (refreshed) {
        try {
          await this.fetchMe()
        } catch {
          // still anonymous — server will clear rev_session on the next
          // 401-triggered clearAuthCookies response
        }
      }
    }
    runInAction(() => {
      this.isLoaded = true
    })
  }

  public async afterLogin(accessToken?: string | null): Promise<void> {
    if (accessToken !== undefined) {
      runInAction(() => {
        this.token = accessToken
      })
    }
    // rev_session is set by the server's setAuthCookies response, no
    // client-side bookkeeping required.
    await this.fetchMe()
  }

  public setBearerToken(token: string | null): void {
    runInAction(() => {
      this.token = token
    })
    this.apiService.setToken(token)
  }

  public async logout(): Promise<void> {
    try {
      await fetch(LOGOUT_URL, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // ignore — we still clear local state below
    }
    this.apiService.setToken(null)
    runInAction(() => {
      this.user = null
      this.token = null
    })
    this.systemPermissions.clearAll()
  }

  public async refresh(): Promise<boolean> {
    return this.tryRefresh()
  }

  public async fetchMe(): Promise<void> {
    try {
      const result = await this.apiService.client.getMe()
      runInAction(() => {
        this.user = result.me
      })

      this.systemPermissions.setUserRole(result.me.role ?? null)
      this.loadOrganizationPermissions(result.me)
    } catch (e) {
      runInAction(() => {
        this.user = null
      })
      throw e
    }
  }

  private tryRefresh(): Promise<boolean> {
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const promise = this.doRefresh()
    runInAction(() => {
      this.refreshPromise = promise
    })
    void promise.finally(() => {
      runInAction(() => {
        this.refreshPromise = null
      })
    })
    return promise
  }

  private async doRefresh(): Promise<boolean> {
    try {
      const response = await fetch(REFRESH_URL, {
        method: 'POST',
        credentials: 'include',
      })
      return response.ok
    } catch {
      return false
    }
  }

  private static hasSessionCookie(): boolean {
    if (typeof document === 'undefined') {
      return false
    }
    const cookieString = document.cookie
    if (!cookieString) {
      return false
    }
    // RFC 6265: cookies are separated by "; ". Match name = literal "1".
    return cookieString.split(';').some((entry) => entry.trim() === `${SESSION_COOKIE_NAME}=1`)
  }

  private loadOrganizationPermissions(me: UserFragment): void {
    const orgPermissions = me.organization?.userOrganization?.role?.permissions
    const organizationId = me.organization?.id

    if (orgPermissions && organizationId) {
      const permissions = orgPermissions.map((p) => ({
        id: p.id,
        action: p.action,
        subject: p.subject,
        condition: (p.condition as Record<string, unknown>) ?? null,
      }))
      this.permissionService.addOrganizationPermissions(organizationId, permissions)
    }
  }
}

container.register(
  AuthService,
  () => {
    const apiService = container.get(ApiService)
    const systemPermissions = container.get(SystemPermissions)
    const permissionService = container.get(PermissionService)
    const authService = new AuthService(apiService, systemPermissions, permissionService)
    void authService.initialize()
    return authService
  },
  { scope: 'singleton' },
)
