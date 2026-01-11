import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { BranchItemFragment } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import {
  APP_ROUTE,
  BRANCH_ROUTE,
  DRAFT_TAG,
  HEAD_TAG,
  ORGANIZATION_ROUTE,
  PROJECT_ROUTE,
  REVISION_ROUTE,
} from 'src/shared/config/routes.ts'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { BranchesDataSource } from '../api/BranchesDataSource.ts'

export type BranchItemViewModelFactoryFn = (item: BranchItemFragment, onDeleted: () => void) => BranchItemViewModel

export class BranchItemViewModelFactory {
  constructor(public readonly create: BranchItemViewModelFactoryFn) {}
}

export class BranchItemViewModel {
  private _isDeletePopoverOpen = false

  constructor(
    private readonly context: ProjectContext,
    private readonly projectPermissions: ProjectPermissions,
    private readonly dataSource: BranchesDataSource,
    private readonly item: BranchItemFragment,
    private readonly onDeleted: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isDeletePopoverOpen(): boolean {
    return this._isDeletePopoverOpen
  }

  public setDeletePopoverOpen(value: boolean): void {
    this._isDeletePopoverOpen = value
  }

  public get id(): string {
    return this.item.id
  }

  public get name(): string {
    return this.item.name
  }

  public get isRoot(): boolean {
    return this.item.isRoot
  }

  public get touched(): boolean {
    return this.item.touched
  }

  public get createdAt(): Date {
    return new Date(this.item.createdAt)
  }

  public get parentBranchName(): string | null {
    return this.item.parent?.revision?.branch?.name ?? null
  }

  public get parentRevisionId(): string | null {
    return this.item.parent?.revision?.id ?? null
  }

  public get parentRevisionLabel(): string | null {
    const revision = this.item.parent?.revision
    if (!revision) {
      return null
    }

    if (revision.isDraft) {
      return 'draft'
    }

    if (revision.isHead) {
      return 'head'
    }

    return revision.id.slice(0, 7)
  }

  public get parentRevisionLink(): string | null {
    const revision = this.item.parent?.revision
    if (!revision) {
      return null
    }

    const branchName = revision.branch?.name
    if (!branchName) {
      return null
    }

    let revisionTag: string
    if (revision.isDraft) {
      revisionTag = DRAFT_TAG
    } else if (revision.isHead) {
      revisionTag = HEAD_TAG
    } else {
      revisionTag = revision.id
    }

    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}/${REVISION_ROUTE}`, {
      organizationId: this.context.organizationId,
      projectName: this.context.projectName,
      branchName: branchName,
      revisionIdOrTag: revisionTag,
    })
  }

  public get canDelete(): boolean {
    return !this.isRoot && this.projectPermissions.canDeleteBranch
  }

  public get link(): string {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}/${REVISION_ROUTE}`, {
      organizationId: this.context.organizationId,
      projectName: this.context.projectName,
      branchName: this.name,
      revisionIdOrTag: DRAFT_TAG,
    })
  }

  public async delete(): Promise<void> {
    const success = await this.dataSource.deleteBranch(this.name)
    if (success) {
      this.onDeleted()
    }
  }
}

container.register(
  BranchItemViewModelFactory,
  () => {
    return new BranchItemViewModelFactory((item, onDeleted) => {
      const context = container.get(ProjectContext)
      const projectPermissions = container.get(ProjectPermissions)
      const dataSource = container.get(BranchesDataSource)
      return new BranchItemViewModel(context, projectPermissions, dataSource, item, onDeleted)
    })
  },
  { scope: 'request' },
)
