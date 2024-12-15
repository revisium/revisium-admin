import { makeAutoObservable } from 'mobx'
import { CreateBranchByRevisionIdCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateBranchByRevisionIdCommand.ts'
import { CreateRevisionCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateRevisionCommand.ts'
import { RevertChangesCommand } from 'src/shared/model/BackendStore/handlers/mutations/RevertChangesCommand.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class BranchActionsWidgetModel {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get showCreateBranchCard() {
    if (this.revision) {
      const wasRevisions = this.branch.start.id !== this.branch.head.id
      const isDraftRevisionAvailable = this.branch.touched

      return (wasRevisions || isDraftRevisionAvailable) && !(this.revision.id === this.branch.draft.id)
    }
  }

  public get showActions() {
    if (this.revision) {
      return this.branch.touched && this.revision.id === this.branch.draft.id
    }
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  private get revision() {
    return this.projectPageModel.revision
  }

  public init() {}

  public dispose() {}

  public async createBranchByRevisionId(branchName: string) {
    if (!this.revision) {
      throw new Error('Not found revision')
    }

    try {
      const command = new CreateBranchByRevisionIdCommand(this.rootStore, this.projectPageModel, branchName)
      await command.execute()
    } catch (e) {
      console.error(e)
    }
  }

  public async revertChanges() {
    try {
      const command = new RevertChangesCommand(this.projectPageModel)
      await command.execute()
    } catch (e) {
      console.log(e)
    }
  }

  public async createRevision(comment: string) {
    try {
      const command = new CreateRevisionCommand(this.rootStore, this.projectPageModel, comment)
      await command.execute()
    } catch (e) {
      console.error(e)
    }
  }
}
