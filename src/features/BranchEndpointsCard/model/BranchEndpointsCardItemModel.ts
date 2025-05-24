import { makeAutoObservable } from 'mobx'
import { EndpointType } from 'src/__generated__/globalTypes.ts'
import { SANDBOX_ROUTE } from 'src/shared/config/routes.ts'
import { getEnv } from 'src/shared/env/getEnv.ts'
import { IEndpointModel } from 'src/shared/model/BackendStore'
import { CreateEndpointCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateEndpointCommand.ts'
import { DeleteEndpointCommand } from 'src/shared/model/BackendStore/handlers/mutations/DeleteEndpointCommand.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

const BASE_URL = getEnv('REACT_APP_ENDPOINT_SERVER_URL')

export const URL_MAPPER = {
  [EndpointType.GRAPHQL]: 'graphql',
  [EndpointType.REST_API]: 'swagger',
}

export class BranchEndpointsCardItemModel {
  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly endpointType: EndpointType,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get href(): string | undefined {
    if (!this.endpoint) {
      return
    }

    const baseUrl = `${this.baseUrl}/${this.organization.id}/${this.project.name}/${this.branch.name}`

    if (this.projectPageModel.isDraftRevision) {
      return `${baseUrl}/draft`
    } else if (this.projectPageModel.isHeadRevision) {
      return `${baseUrl}/head`
    } else {
      return `${baseUrl}/${this.revision.id}`
    }
  }

  public async switch() {
    try {
      if (this.endpoint) {
        const command = new DeleteEndpointCommand(this.projectPageModel, this.endpoint.id)
        return await command.execute()
      } else {
        const command = new CreateEndpointCommand(rootStore, this.projectPageModel, this.endpointType)
        return command.execute()
      }
    } catch (e) {
      console.log(e)
    }
  }

  public init() {}

  public dispose() {}

  private get endpoint(): IEndpointModel | undefined {
    return this.revision.endpoints.find((endpoint) => endpoint.type === this.endpointType)
  }

  private get organization() {
    return this.projectPageModel.organization
  }

  private get project() {
    return this.projectPageModel.project
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }

  private get baseUrl() {
    if (this.endpointType === EndpointType.GRAPHQL) {
      return `/${SANDBOX_ROUTE}`
    }

    return `${BASE_URL}/${URL_MAPPER[this.endpointType]}`
  }
}
