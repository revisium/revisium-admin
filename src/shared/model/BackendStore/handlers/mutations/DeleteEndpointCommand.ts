import { deleteEndpointMstRequest } from 'src/shared/model/BackendStore/api/deleteEndpointMstRequest.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class DeleteEndpointCommand {
  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly endpointId: string,
  ) {}

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }

  public async execute() {
    const result = await this.deleteEndpointRequest()

    this.updateRevision()

    return result
  }

  private async deleteEndpointRequest() {
    const response = await deleteEndpointMstRequest({
      data: { endpointId: this.endpointId },
    })

    return response.deleteEndpoint
  }

  private updateRevision() {
    this.revision.removeEndpoint(this.endpointId)
  }
}
