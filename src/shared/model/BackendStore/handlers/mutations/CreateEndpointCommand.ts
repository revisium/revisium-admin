import { EndpointType } from 'src/__generated__/globalTypes.ts'
import { IEndpointModel } from 'src/shared/model/BackendStore'
import { createEndpointMstRequest } from 'src/shared/model/BackendStore/api/createEndpointMstRequest.ts'
import { EndpointMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/endpoint.generated.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformEndpointFragment } from 'src/shared/model/BackendStore/utils/transformEndpointFragment.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class CreateEndpointCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
    private readonly endpointType: EndpointType,
  ) {}

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }

  public async execute() {
    const endpoint = await this.createEndpointRequest()

    this.updateRevision(endpoint)

    return endpoint
  }

  private async createEndpointRequest() {
    const response = await createEndpointMstRequest({
      data: { revisionId: this.revision.id, type: this.endpointType },
    })

    return this.addEndpointToCache(response.createEndpoint)
  }

  private addEndpointToCache(endpointFragment: EndpointMstFragment) {
    return this.rootStore.cache.addEndpoint(transformEndpointFragment(endpointFragment))
  }

  private updateRevision(endpoint: IEndpointModel) {
    this.revision.addEndpoint(endpoint)
  }
}
