import { makeAutoObservable } from 'mobx'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { CHANGES_ROUTE } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { BranchMutationDataSource } from 'src/widgets/SidebarBranchWidget/model/BranchMutationDataSource.ts'

export class SidebarBranchWidgetModel {
  constructor(
    private readonly linkMaker: LinkMaker,
    private readonly context: ProjectContext,
    private readonly permissionContext: PermissionContext,
    private readonly mutationDataSource: BranchMutationDataSource,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get name() {
    return this.context.branchName
  }

  public get postfix() {
    if (this.context.isHeadRevision) {
      return ' [head]'
    }

    if (this.context.isDraftRevision) {
      return ''
    }

    const shortId = this.context.revisionId.slice(0, 3)

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
    return this.context.isDraftRevision && this.context.touched
  }

  public get changesLink(): string {
    return `${this.linkMaker.currentBaseLink}/${CHANGES_ROUTE}`
  }

  public init() {}

  public dispose() {
    this.mutationDataSource.dispose()
  }

  public async handleRevertChanges() {
    try {
      const result = await this.mutationDataSource.revertChanges({
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
        branchName: this.context.branchName,
      })

      if (result) {
        this.context.updateTouched(false)
        globalThis.location.reload()
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async handleCommitChanges(comment: string) {
    try {
      const result = await this.mutationDataSource.createRevision({
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
        branchName: this.context.branchName,
        comment,
      })

      if (result) {
        globalThis.location.reload()
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async handleCreateBranch(name: string) {
    try {
      const result = await this.mutationDataSource.createBranch({
        revisionId: this.context.revisionId,
        branchName: name,
      })

      if (result) {
        globalThis.location.reload()
      }
    } catch (e) {
      console.error(e)
    }
  }
}

container.register(
  SidebarBranchWidgetModel,
  () => {
    return new SidebarBranchWidgetModel(
      container.get(LinkMaker),
      container.get(ProjectContext),
      container.get(PermissionContext),
      container.get(BranchMutationDataSource),
    )
  },
  { scope: 'request' },
)
