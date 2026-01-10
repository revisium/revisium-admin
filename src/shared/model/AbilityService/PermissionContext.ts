import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { AbilityService } from './AbilityService.ts'
import { Actions, PermissionRule, Subjects } from './types.ts'

export interface PermissionData {
  id: string
  action: string
  subject: string
  condition?: unknown
}

export interface RoleData {
  permissions: PermissionData[]
}

export interface ProjectPermissionData {
  isPublic: boolean
  userProject?: {
    role: RoleData
  } | null
  organization?: {
    userOrganization?: {
      role: RoleData
    } | null
  }
}

export class PermissionContext {
  private _isPublic: boolean = false
  private _userRole: RoleData | null = null

  constructor(private readonly abilityService: AbilityService) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isPublic(): boolean {
    return this._isPublic
  }

  public setUserRole(role: RoleData | null): void {
    this._userRole = role
    this.updateAbilityFromUserRole()
  }

  private updateAbilityFromUserRole(): void {
    if (!this._userRole?.permissions) {
      return
    }

    const permissions: PermissionRule[] = this._userRole.permissions.map((p) => ({
      id: p.id,
      action: p.action,
      subject: p.subject,
      condition: p.condition as Record<string, unknown> | null,
    }))

    this.abilityService.updateAbility(permissions)
  }

  public setProject(project: ProjectPermissionData): void {
    this._isPublic = project.isPublic

    const permissions = this.extractPermissions(project)
    this.abilityService.updateAbility(permissions)
  }

  public clearProject(): void {
    this._isPublic = false
    this.abilityService.clearAbility()
  }

  public can(action: Actions, subject: Subjects, conditions?: Record<string, unknown>): boolean {
    return this.abilityService.can(action, subject, conditions)
  }

  public cannot(action: Actions, subject: Subjects, conditions?: Record<string, unknown>): boolean {
    return this.abilityService.cannot(action, subject, conditions)
  }

  public get canReadProject(): boolean {
    return this.can('read', 'Project', { isPublic: this._isPublic })
  }

  public get canUpdateProject(): boolean {
    return this.can('update', 'Project')
  }

  public get canDeleteProject(): boolean {
    return this.can('delete', 'Project')
  }

  public get canCreateProject(): boolean {
    return this.can('create', 'Project')
  }

  public get canCreateBranch(): boolean {
    return this.can('create', 'Branch')
  }

  public get canDeleteBranch(): boolean {
    return this.can('delete', 'Branch')
  }

  public get canCreateRevision(): boolean {
    return this.can('create', 'Revision')
  }

  public get canRevertRevision(): boolean {
    return this.can('revert', 'Revision')
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

  public get canCreateRow(): boolean {
    return this.can('create', 'Row')
  }

  public get canUpdateRow(): boolean {
    return this.can('update', 'Row')
  }

  public get canDeleteRow(): boolean {
    return this.can('delete', 'Row')
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

  public get canCreateUser(): boolean {
    return this.can('create', 'User')
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

  private extractPermissions(project: ProjectPermissionData): PermissionRule[] {
    const permissions: PermissionRule[] = []
    const seen = new Set<string>()

    if (this._userRole?.permissions) {
      for (const p of this._userRole.permissions) {
        if (!seen.has(p.id)) {
          seen.add(p.id)
          permissions.push({
            id: p.id,
            action: p.action,
            subject: p.subject,
            condition: p.condition as Record<string, unknown> | null,
          })
        }
      }
    }

    if (project.userProject?.role?.permissions) {
      for (const p of project.userProject.role.permissions) {
        if (!seen.has(p.id)) {
          seen.add(p.id)
          permissions.push({
            id: p.id,
            action: p.action,
            subject: p.subject,
            condition: p.condition as Record<string, unknown> | null,
          })
        }
      }
    }

    if (project.organization?.userOrganization?.role?.permissions) {
      for (const p of project.organization.userOrganization.role.permissions) {
        if (!seen.has(p.id)) {
          seen.add(p.id)
          permissions.push({
            id: p.id,
            action: p.action,
            subject: p.subject,
            condition: p.condition as Record<string, unknown> | null,
          })
        }
      }
    }

    return permissions
  }
}

container.register(
  PermissionContext,
  () => {
    const abilityService = container.get(AbilityService)
    return new PermissionContext(abilityService)
  },
  { scope: 'singleton' },
)
