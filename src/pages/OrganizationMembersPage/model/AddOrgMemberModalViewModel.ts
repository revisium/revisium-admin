import { OrganizationContext } from 'src/entities/Organization/model/OrganizationContext.ts'
import { BaseAddMemberModalViewModel } from 'src/shared/model/AddMemberModal/BaseAddMemberModalViewModel.ts'
import { SystemPermissions } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { UserOrganizationRoles } from 'src/__generated__/graphql-request'

export class AddOrgMemberModalViewModel extends BaseAddMemberModalViewModel<UserOrganizationRoles> {
  constructor(
    private readonly context: OrganizationContext,
    systemPermissions: SystemPermissions,
    onMemberAdded: () => void,
  ) {
    super(systemPermissions, onMemberAdded, UserOrganizationRoles.Reader)
  }

  protected async addUser(userId: string, roleId: UserOrganizationRoles): Promise<boolean> {
    const result = await client.addUserToOrganization({
      organizationId: this.context.organizationId,
      userId,
      roleId,
    })
    return result.addUserToOrganization
  }
}
