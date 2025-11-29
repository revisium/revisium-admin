import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { AbilityService } from './AbilityService.ts'
import { Actions, PermissionRule, Subjects } from './types.ts'

export interface ProjectPermissionData {
  isPublic: boolean
  userProject?: {
    role: {
      permissions: Array<{
        id: string
        action: string
        subject: string
        condition?: unknown
      }>
    }
  } | null
  organization?: {
    userOrganization?: {
      role: {
        permissions: Array<{
          id: string
          action: string
          subject: string
          condition?: unknown
        }>
      }
    } | null
  }
}

export class PermissionContext {
  private _isPublic: boolean = false

  constructor(private readonly abilityService: AbilityService) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isPublic(): boolean {
    return this._isPublic
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

  public get canCreateBranch(): boolean {
    return this.can('create', 'Branch')
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

    // Extract from organization role
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
