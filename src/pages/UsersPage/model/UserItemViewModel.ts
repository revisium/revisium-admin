import { makeAutoObservable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { UserProjectItemFragment, UserProjectRoles } from 'src/__generated__/graphql-request'

export class UserItemViewModel {
  private _isUpdating = false
  private _isRemoving = false
  private _roleId: UserProjectRoles

  constructor(
    private readonly context: ProjectContext,
    private readonly permissionContext: PermissionContext,
    private readonly data: UserProjectItemFragment,
    private readonly onRemoved: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this._roleId = this.data.role.id as UserProjectRoles
  }

  public get id(): string {
    return this.data.id
  }

  public get userId(): string {
    return this.data.user.id
  }

  public get username(): string | null {
    return this.data.user.username ?? null
  }

  public get email(): string | null {
    return this.data.user.email ?? null
  }

  public get displayName(): string {
    return this.username || this.email || this.userId
  }

  public get roleId(): UserProjectRoles {
    return this._roleId
  }

  public get roleName(): string {
    return this.data.role.name
  }

  public get canUpdateRole(): boolean {
    return this.permissionContext.canUpdateUser
  }

  public get canRemove(): boolean {
    return this.permissionContext.canDeleteUser
  }

  public get isUpdating(): boolean {
    return this._isUpdating
  }

  public get isRemoving(): boolean {
    return this._isRemoving
  }

  public async updateRole(roleId: UserProjectRoles): Promise<void> {
    if (this._isUpdating || roleId === this._roleId) {
      return
    }

    this._isUpdating = true

    try {
      const result = await client.updateUserProjectRole({
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
        userId: this.userId,
        roleId,
      })

      runInAction(() => {
        if (result.updateUserProjectRole) {
          this._roleId = roleId
        }
      })
    } catch (error) {
      console.error('Failed to update user role:', error)
    } finally {
      runInAction(() => {
        this._isUpdating = false
      })
    }
  }

  public async remove(): Promise<void> {
    if (this._isRemoving) {
      return
    }

    this._isRemoving = true

    try {
      const result = await client.removeUserFromProject({
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
        userId: this.userId,
      })

      runInAction(() => {
        if (result.removeUserFromProject) {
          this.onRemoved()
        }
      })
    } catch (error) {
      console.error('Failed to remove user:', error)
    } finally {
      runInAction(() => {
        this._isRemoving = false
      })
    }
  }
}
