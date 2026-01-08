import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'

export class RouterParams {
  public organizationId: string | null = null
  public projectName: string | null = null
  public branchName: string | null = null
  public revisionIdOrTag: string | null = null
  public tableId: string | null = null
  public rowId: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  public update(params: Record<string, string | undefined>): void {
    this.organizationId = params['organizationId'] ?? null
    this.projectName = params['projectName'] ?? null
    this.branchName = params['branchName'] ?? null
    this.revisionIdOrTag = params['revisionIdOrTag'] ?? null
    this.tableId = params['tableId'] ?? null
    this.rowId = params['rowId'] ?? null
  }

  public clear(): void {
    this.organizationId = null
    this.projectName = null
    this.branchName = null
    this.revisionIdOrTag = null
    this.tableId = null
    this.rowId = null
  }
}

container.register(RouterParams, () => new RouterParams(), { scope: 'singleton' })
