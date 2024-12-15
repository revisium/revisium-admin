import { makeAutoObservable } from 'mobx'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class BranchEndpointsCardModel {
  constructor(private readonly projectPageModel: ProjectPageModel) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get branchTitle() {
    const name = this.projectPageModel.branchOrThrow.name

    const prefix = `Branch: ${name}`

    if (this.projectPageModel.isHeadRevision) {
      return `${prefix}[head]`
    } else if (this.projectPageModel.isDraftRevision) {
      return `${prefix}[draft]`
    } else {
      return `${prefix}[${this.projectPageModel.revisionOrThrow.id.substring(0, 6)}]`
    }
  }

  public get isThereEndpoint() {
    return Boolean(this.projectPageModel.revisionOrThrow.endpoints.length)
  }

  public init() {}

  public dispose() {}
}
