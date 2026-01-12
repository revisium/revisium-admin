import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { PermissionService } from './PermissionService.ts'

export interface IProjectContextData {
  readonly projectId: string | null
  readonly organizationId: string | null
  readonly isPublic: boolean
  readonly projectRoleName: string | null
}

export class ProjectPermissions {
  private _contextProvider: (() => IProjectContextData) | null = null

  constructor(private readonly permissionService: PermissionService) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public setContextProvider(provider: () => IProjectContextData): void {
    this._contextProvider = provider
  }

  private get context(): IProjectContextData {
    return (
      this._contextProvider?.() ?? {
        projectId: null,
        organizationId: null,
        isPublic: false,
        projectRoleName: null,
      }
    )
  }

  public get projectId(): string | null {
    return this.context.projectId
  }

  public get organizationId(): string | null {
    return this.context.organizationId
  }

  public get isPublic(): boolean {
    return this.context.isPublic
  }

  public get projectRoleName(): string | null {
    return this.context.projectRoleName
  }

  private getProjectContext(): Record<string, unknown> {
    const ctx = this.context
    const result: Record<string, unknown> = {}
    if (ctx.projectId) {
      result.projectId = ctx.projectId
    }
    if (ctx.organizationId) {
      result.organizationId = ctx.organizationId
    }
    return result
  }

  private can(action: string, subject: string, conditions?: Record<string, unknown>): boolean {
    const ctx = conditions ?? this.getProjectContext()
    return this.permissionService.can(
      action as Parameters<PermissionService['can']>[0],
      subject as Parameters<PermissionService['can']>[1],
      Object.keys(ctx).length > 0 ? ctx : undefined,
    )
  }

  public get canReadProject(): boolean {
    return this.can('read', 'Project', {
      ...this.getProjectContext(),
      isPublic: this.context.isPublic,
    })
  }

  public get canUpdateProject(): boolean {
    return this.can('update', 'Project')
  }

  public get canDeleteProject(): boolean {
    return this.can('delete', 'Project')
  }

  public get canReadBranch(): boolean {
    return this.can('read', 'Branch')
  }

  public get canCreateBranch(): boolean {
    return this.can('create', 'Branch')
  }

  public get canDeleteBranch(): boolean {
    return this.can('delete', 'Branch')
  }

  public get canReadRevision(): boolean {
    return this.can('read', 'Revision')
  }

  public get canCreateRevision(): boolean {
    return this.can('create', 'Revision')
  }

  public get canRevertRevision(): boolean {
    return this.can('revert', 'Revision')
  }

  public get canReadTable(): boolean {
    return this.can('read', 'Table')
  }

  public get canCreateTable(): boolean {
    return this.can('create', 'Table')
  }

  public get canUpdateTable(): boolean {
    return this.can('update', 'Table')
  }

  public get canDeleteTable(): boolean {
    return this.can('delete', 'Table')
  }

  public get canReadRow(): boolean {
    return this.can('read', 'Row')
  }

  public get canCreateRow(): boolean {
    return this.can('create', 'Row')
  }

  public get canUpdateRow(): boolean {
    return this.can('update', 'Row')
  }

  public get canDeleteRow(): boolean {
    return this.can('delete', 'Row')
  }

  public get canReadEndpoint(): boolean {
    return this.can('read', 'Endpoint')
  }

  public get canCreateEndpoint(): boolean {
    return this.can('create', 'Endpoint')
  }

  public get canDeleteEndpoint(): boolean {
    return this.can('delete', 'Endpoint')
  }

  public get canAddUser(): boolean {
    return this.can('add', 'User')
  }

  public get canUpdateUser(): boolean {
    return this.can('update', 'User')
  }

  public get canDeleteUser(): boolean {
    return this.can('delete', 'User')
  }

  public get canReadUser(): boolean {
    return this.can('read', 'User')
  }

  public get canManageUsers(): boolean {
    return this.canAddUser || this.canReadUser
  }

  public get canAccessSettings(): boolean {
    return this.canUpdateProject || this.canDeleteProject
  }

  public get canWrite(): boolean {
    return (
      this.canCreateTable ||
      this.canUpdateTable ||
      this.canDeleteTable ||
      this.canCreateRow ||
      this.canUpdateRow ||
      this.canDeleteRow
    )
  }

  public get isReadOnly(): boolean {
    return !this.canWrite
  }
}

container.register(
  ProjectPermissions,
  () => {
    const permissionService = container.get(PermissionService)
    return new ProjectPermissions(permissionService)
  },
  { scope: 'singleton' },
)
