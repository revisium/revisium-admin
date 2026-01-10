import { makeAutoObservable } from 'mobx'
import { copyToClipboard, getOrigin } from 'src/shared/lib'

export class SystemApiViewModel {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get restApiUrl(): string {
    return `${getOrigin()}/api-json`
  }

  public get restApiSwaggerUrl(): string {
    return `${getOrigin()}/api`
  }

  public get graphqlUrl(): string {
    return `${getOrigin()}/graphql`
  }

  public get graphqlSandboxUrl(): string {
    return `${getOrigin()}/graphql`
  }

  public copyRestApiUrl(): void {
    void copyToClipboard(this.restApiUrl)
  }

  public copyGraphqlUrl(): void {
    void copyToClipboard(this.graphqlUrl)
  }
}
