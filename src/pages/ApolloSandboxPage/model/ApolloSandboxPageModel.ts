import { makeAutoObservable } from 'mobx'
import { getEnv } from 'src/shared/env/getEnv.ts'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'

export class ApolloSandboxPageModel {
  constructor(private readonly authService: AuthService) {
    makeAutoObservable(this)
  }

  public get token() {
    return this.authService.token
  }

  public get document() {
    return `query ExampleQuery {
  table {
    id
  }
}`
  }

  public get baseUrl() {
    const url = getEnv('REACT_APP_ENDPOINT_SERVER_URL')

    return `${globalThis.location.origin}${url}/graphql`
  }

  public dispose(): void {}

  public init(): void {}
}

container.register(
  ApolloSandboxPageModel,
  () => {
    const authService = container.get(AuthService)

    return new ApolloSandboxPageModel(authService)
  },
  { scope: 'request' },
)
