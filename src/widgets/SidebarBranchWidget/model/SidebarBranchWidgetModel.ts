import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { CreateRevisionCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateRevisionCommand.ts'
import { RevertChangesCommand } from 'src/shared/model/BackendStore/handlers/mutations/RevertChangesCommand.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { invariant } from 'src/shared/lib'
import { rootStore } from 'src/shared/model/RootStore.ts'

export class SidebarBranchWidgetModel {
  private _project: ProjectPageModel | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoading() {
    return !this._project
  }

  public get name() {
    return this.project.branchOrThrow.name
  }

  public get postfix() {
    if (this.project.isHeadRevision) {
      return ' [head]'
    }

    if (this.project.isDraftRevision) {
      return ''
    }

    const shortId = this.project.revisionOrThrow.id.slice(0, 3)

    return ` [${shortId}]`
  }

  public get showRevertButton() {
    return this.touched
  }

  public get showCommitButton() {
    return this.touched
  }

  public get showActionsButton() {
    return this.showCommitButton || this.showRevertButton || this.showBranchButton
  }

  public get showBranchButton() {
    return !this.project.isDraftRevision
  }

  public get touched() {
    return this.project.isDraftRevision && this.project.branchOrThrow.touched
  }

  public init(projectPageModel: ProjectPageModel) {
    this._project = projectPageModel
  }

  public dispose() {}

  public async handleRevertChanges() {
    try {
      const command = new RevertChangesCommand(this.project)
      await command.execute()
    } catch (e) {
      console.error(e)
    }
  }

  public async handleCommitChanges(comment: string) {
    try {
      const command = new CreateRevisionCommand(rootStore, this.project, comment)
      await command.execute()
    } catch (e) {
      console.error(e)
    }
  }

  private get project() {
    invariant(this._project, 'SidebarBranchWidgetModel: project is not defined')

    return this._project
  }
}

container.register(
  SidebarBranchWidgetModel,
  () => {
    return new SidebarBranchWidgetModel()
  },
  { scope: 'request' },
)
