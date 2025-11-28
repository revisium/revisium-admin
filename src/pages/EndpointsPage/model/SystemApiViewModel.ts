import { makeAutoObservable } from 'mobx'
import { getEnv } from 'src/shared/env/getEnv.ts'

const ENDPOINT_SERVER_URL = getEnv('REACT_APP_ENDPOINT_SERVER_URL')

export class SystemApiViewModel {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get baseUrl(): string {
    return ENDPOINT_SERVER_URL || window.location.origin
  }

  public get restApiUrl(): string {
    return `${this.baseUrl}/api`
  }

  public get graphqlUrl(): string {
    return `${this.baseUrl}/graphql`
  }

  public copyUrl(url: string): void {
    void navigator.clipboard.writeText(url)
  }
}
