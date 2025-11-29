import { makeAutoObservable } from 'mobx'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { CHANGES_ROUTE } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { CreateBranchByRevisionIdCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateBranchByRevisionIdCommand.ts'
import { CreateRevisionCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateRevisionCommand.ts'
import { RevertChangesCommand } from 'src/shared/model/BackendStore/handlers/mutations/RevertChangesCommand.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export class SidebarBranchWidgetModel {
  constructor(
    private readonly linkMaker: LinkMaker,
    private readonly context: ProjectContext,
    private readonly permissionContext: PermissionContext,
  ) {
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
    return this.touched && this.permissionContext.canRevertRevision
  }

  public get showCommitButton() {
    return this.touched && this.permissionContext.canCreateRevision
  }

  public get showActionsButton() {
    return this.showCommitButton || this.showRevertButton || this.showCreateBranchButton
  }

  public get showCreateBranchButton() {
    return !this.context.isDraftRevision && this.permissionContext.canCreateBranch
  }

  public get touched() {
    return this.context.isDraftRevision && this.context.branch.touched
  }

  public get changesLink(): string {
    return `${this.linkMaker.currentBaseLink}/${CHANGES_ROUTE}`
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
    const permissionContext = container.get(PermissionContext)

    return new SidebarBranchWidgetModel(new LinkMaker(context), context, permissionContext)
  },
  { scope: 'request' },
)
