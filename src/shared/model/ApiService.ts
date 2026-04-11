import { ClientError, GraphQLClient, RequestDocument, Variables } from 'graphql-request'
import { getSdk, Sdk } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { EnvironmentService } from 'src/shared/model/EnvironmentService.ts'
import { toaster } from 'src/shared/ui'

type UnauthorizedHandler = () => Promise<boolean>

export class ApiService {
  private readonly graphQLClient: GraphQLClient
  public readonly client: Sdk

  private onUnauthorized: UnauthorizedHandler | null = null

  constructor(private readonly environmentService: EnvironmentService) {
    const url = this.environmentService.get('REACT_APP_GRAPHQL_SERVER_URL')

    if (!url) {
      throw new Error(`Invalid REACT_APP_GRAPHQL_SERVER_URL`)
    }

    this.graphQLClient = new GraphQLClient(url, {
      credentials: 'include',
      responseMiddleware: (response) => {
        if (response instanceof ClientError && ApiService.isUnauthorized(response)) {
          return
        }
        const error = (response as { response?: { errors?: { message?: string }[] } })?.response?.errors?.[0]?.message

        if (error) {
          toaster.info({
            duration: 3000,
            description: error,
          })
        }
      },
    })

    this.wrapRequestWithRefreshRetry()

    this.client = getSdk(this.graphQLClient)
  }

  public setToken(token: string | null) {
    this.graphQLClient.setHeaders(token ? { Authorization: `Bearer ${token}` } : {})
  }

  public setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
    this.onUnauthorized = handler
  }

  private wrapRequestWithRefreshRetry() {
    const originalRequest = this.graphQLClient.request.bind(this.graphQLClient) as (
      document: RequestDocument,
      variables?: Variables,
      requestHeaders?: Record<string, string>,
    ) => Promise<unknown>

    const wrapped = async (
      document: RequestDocument,
      variables?: Variables,
      requestHeaders?: Record<string, string>,
    ): Promise<unknown> => {
      try {
        return await originalRequest(document, variables, requestHeaders)
      } catch (e) {
        if (!ApiService.isUnauthorized(e) || !this.onUnauthorized) {
          throw e
        }
        const refreshed = await this.onUnauthorized()
        if (!refreshed) {
          throw e
        }
        return await originalRequest(document, variables, requestHeaders)
      }
    }

    ;(this.graphQLClient as unknown as { request: typeof wrapped }).request = wrapped
  }

  private static isUnauthorized(error: unknown): boolean {
    if (!(error instanceof ClientError)) {
      return false
    }
    if (error.response.status === 401) {
      return true
    }
    // Yoga/NestJS GraphQL drivers return HTTP 200 with `errors[0].message`
    // when a resolver throws UnauthorizedException. Detect that too, otherwise
    // GraphQL requests never trigger the refresh/retry path.
    const errors = (error.response as { errors?: unknown[] } | undefined)?.errors
    if (!Array.isArray(errors) || errors.length === 0) {
      return false
    }
    return errors.some((e) => {
      if (typeof e !== 'object' || e === null) {
        return false
      }
      const candidate = e as {
        message?: unknown
        extensions?: { code?: unknown; originalError?: { statusCode?: unknown } }
      }
      const message = typeof candidate.message === 'string' ? candidate.message : ''
      if (/^unauthorized$/i.test(message.trim())) {
        return true
      }
      const code = candidate.extensions?.code
      if (typeof code === 'string' && /^UNAUTHENTICATED$/i.test(code)) {
        return true
      }
      const statusCode = candidate.extensions?.originalError?.statusCode
      if (statusCode === 401) {
        return true
      }
      return false
    })
  }
}

container.register(
  ApiService,
  () => {
    const environmentService = container.get(EnvironmentService)
    return new ApiService(environmentService)
  },
  { scope: 'singleton' },
)

export const client = container.get(ApiService).client
