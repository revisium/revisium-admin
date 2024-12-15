import { DeleteProjectCommand } from 'src/shared/model/BackendStore/handlers/mutations/DeleteProjectCommand.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'

export class DeleteProjectModel {
  public constructor(private readonly rootStore: IRootStore) {}

  public async delete(organizationId: string, projectName: string): Promise<boolean> {
    try {
      const command = new DeleteProjectCommand(this.rootStore, organizationId, projectName)
      return await command.execute()
    } catch (e) {
      console.error(e)

      return false
    }
  }

  public init() {}

  public dispose() {}
}
