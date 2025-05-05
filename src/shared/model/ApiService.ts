import { GraphQLClient } from 'graphql-request'
import { getSdk, Sdk } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { EnvironmentService } from 'src/shared/model/EnvironmentService.ts'
import { standaloneToast } from 'src/shared/ui'

export class ApiService {
  private readonly graphQLClient: GraphQLClient
  public readonly client: Sdk

  constructor(private readonly environmentService: EnvironmentService) {
    const url = this.environmentService.get('REACT_APP_GRAPHQL_SERVER_URL')

    if (!url) {
      throw new Error(`Invalid REACT_APP_GRAPHQL_SERVER_URL`)
    }

    this.graphQLClient = new GraphQLClient(url, {
      responseMiddleware: (response) => {
        const error = response['response']?.errors[0].message

        if (error) {
          standaloneToast({
            status: 'error',
            variant: 'left-accent',
            colorScheme: 'red',
            duration: 3000,
            isClosable: true,
            position: 'top',
            description: error,
          })
        }

        return response
      },
    })
    this.client = getSdk(this.graphQLClient)
  }

  public setToken(token: string | null) {
    this.graphQLClient.setHeaders(token ? { Authorization: `Bearer ${token}` } : {})
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
