import { makeAutoObservable } from 'mobx'
import { copyToClipboard, getOrigin } from 'src/shared/lib'

export class SystemApiViewModel {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get restApiUrl(): string {
    return `${getOrigin()}/api`
  }

  public get graphqlUrl(): string {
    return `${getOrigin()}/graphql`
  }

  public copyUrl(url: string): void {
    void copyToClipboard(url)
  }
}
