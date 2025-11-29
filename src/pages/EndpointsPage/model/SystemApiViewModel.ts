import { makeAutoObservable } from 'mobx'

export class SystemApiViewModel {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get restApiUrl(): string {
    return `${this.endpointBaseUrl}/api`
  }

  public get graphqlUrl(): string {
    return `${this.endpointBaseUrl}/graphql`
  }

  public copyUrl(url: string): void {
    void navigator.clipboard.writeText(url)
  }

  private get endpointBaseUrl(): string {
    return window.location.origin
  }
}
