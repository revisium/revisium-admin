import { makeAutoObservable, runInAction } from 'mobx'
import { OrganizationContext } from 'src/entities/Organization/model/OrganizationContext.ts'
import { PermissionService } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { UserOrganizationItemFragment, UserOrganizationRoles } from 'src/__generated__/graphql-request'

export class OrgMemberItemViewModel {
  private _isRemoving = false

  constructor(
    private readonly context: OrganizationContext,
    private readonly permissionService: PermissionService,
    private readonly data: UserOrganizationItemFragment,
    private readonly onRemoved: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
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

  public get roleId(): UserOrganizationRoles {
    return this.data.role.id as UserOrganizationRoles
  }

  public get roleName(): string {
    return this.data.role.name
  }

  public get isOwner(): boolean {
    return this.roleId === UserOrganizationRoles.OrganizationOwner
  }

  public get canRemove(): boolean {
    if (this.isOwner) {
      return false
    }
    return this.permissionService.can('delete', 'User', { organizationId: this.context.organizationId })
  }

  public get isRemoving(): boolean {
    return this._isRemoving
  }

  public async remove(): Promise<void> {
    if (this._isRemoving) {
      return
    }

    this._isRemoving = true

    try {
      const result = await client.removeUserFromOrganization({
        organizationId: this.context.organizationId,
        userId: this.userId,
      })

      runInAction(() => {
        if (result.removeUserFromOrganization) {
          this.onRemoved()
        }
      })
    } catch (error) {
      console.error('Failed to remove member:', error)
    } finally {
      runInAction(() => {
        this._isRemoving = false
      })
    }
  }
}
