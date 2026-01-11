import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { PermissionService } from './PermissionService.ts'

export interface SystemPermissionData {
  id: string
  action: string
  subject: string
  condition?: unknown
}

export interface SystemRoleData {
  id?: string
  name?: string
  permissions: SystemPermissionData[]
}

export class SystemPermissions {
  constructor(private readonly permissionService: PermissionService) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public setUserRole(role: SystemRoleData | null): void {
    if (role?.permissions) {
      const rules = role.permissions.map((p) => ({
        id: p.id,
        action: p.action,
        subject: p.subject,
        condition: (p.condition as Record<string, unknown>) ?? null,
      }))
      this.permissionService.addSystemPermissions(rules)
    }
  }

  public clearAll(): void {
    this.permissionService.clearAll()
  }

  public get canCreateProject(): boolean {
    return this.permissionService.can('create', 'Project')
  }

  public get canReadUser(): boolean {
    return this.permissionService.can('read', 'User')
  }

  public get canCreateUser(): boolean {
    return this.permissionService.can('create', 'User')
  }

  public get canAddUser(): boolean {
    return this.permissionService.can('add', 'User')
  }

  public get canUpdateUser(): boolean {
    return this.permissionService.can('update', 'User')
  }

  public get canDeleteUser(): boolean {
    return this.permissionService.can('delete', 'User')
  }

  public get canManageUsers(): boolean {
    return this.canAddUser || this.canReadUser
  }

  public get canReadOrganization(): boolean {
    return this.permissionService.can('read', 'Organization')
  }

  public get canUpdateOrganization(): boolean {
    return this.permissionService.can('update', 'Organization')
  }

  public get canDeleteOrganization(): boolean {
    return this.permissionService.can('delete', 'Organization')
  }
}

container.register(
  SystemPermissions,
  () => {
    const permissionService = container.get(PermissionService)
    return new SystemPermissions(permissionService)
  },
  { scope: 'singleton' },
)
