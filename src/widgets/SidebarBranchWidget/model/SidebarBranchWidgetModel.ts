import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { CreateBranchByRevisionIdCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateBranchByRevisionIdCommand.ts'
import { CreateRevisionCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateRevisionCommand.ts'
import { RevertChangesCommand } from 'src/shared/model/BackendStore/handlers/mutations/RevertChangesCommand.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export class SidebarBranchWidgetModel {
  constructor(private context: ProjectContext) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get name() {
    return this.context.branch.name
  }

  public get postfix() {
    if (this.context.isHeadRevision) {
      return ' [head]'
    }

    if (this.context.isDraftRevision) {
      return ''
    }

    const shortId = this.context.revision.id.slice(0, 3)

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
    return !this.context.isDraftRevision
  }

  public get touched() {
    return this.context.isDraftRevision && this.context.branch.touched
  }

  public init() {}

  public dispose() {}

  public async handleRevertChanges() {
    try {
      const command = new RevertChangesCommand(this.context)
      await command.execute()
    } catch (e) {
      console.error(e)
    }
  }

  public async handleCommitChanges(comment: string) {
    try {
      const command = new CreateRevisionCommand(rootStore, this.context, comment)
      await command.execute()
    } catch (e) {
      console.error(e)
    }
  }

  public async handleCreateBranch(name: string) {
    try {
      const command = new CreateBranchByRevisionIdCommand(rootStore, this.context, name)
      await command.execute()
    } catch (e) {
      console.error(e)
    }
  }
}

container.register(
  SidebarBranchWidgetModel,
  () => {
    const context: ProjectContext = container.get(ProjectContext)

    return new SidebarBranchWidgetModel(context)
  },
  { scope: 'request' },
)
