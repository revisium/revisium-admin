import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { BaseAddMemberModalViewModel } from 'src/shared/model/AddMemberModal/BaseAddMemberModalViewModel.ts'
import { SystemPermissions } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { UserProjectRoles } from 'src/__generated__/graphql-request'

export class AddUserModalViewModel extends BaseAddMemberModalViewModel<UserProjectRoles> {
  constructor(
    private readonly context: ProjectContext,
    systemPermissions: SystemPermissions,
    onUserAdded: () => void,
  ) {
    super(systemPermissions, onUserAdded, UserProjectRoles.Reader)
  }

  protected async addUser(userId: string, roleId: UserProjectRoles): Promise<boolean> {
    const result = await client.addUserToProject({
      organizationId: this.context.organizationId,
      projectName: this.context.projectName,
      userId,
      roleId,
    })
    return result.addUserToProject
  }
}
