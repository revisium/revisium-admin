import { makeAutoObservable } from 'mobx'
import { EndpointType } from 'src/__generated__/graphql-request.ts'
import { EndpointFragment, RevisionFragment } from 'src/features/RevisionEndpointPopover/config/types.ts'
import { SANDBOX_ROUTE } from 'src/shared/config/routes.ts'
import { getEnv } from 'src/shared/env/getEnv.ts'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

const BASE_URL = getEnv('REACT_APP_ENDPOINT_SERVER_URL')

export const URL_MAPPER = {
  [EndpointType.Graphql]: 'graphql',
  [EndpointType.RestApi]: 'swagger',
}

export class RevisionEndpointItemModel {
  private readonly createEndpointRequest = ObservableRequest.of(client.createEndpoint)
  private readonly deleteEndpointRequest = ObservableRequest.of(client.deleteEndpoint)

  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly endpointType: EndpointType,
    private readonly revision: RevisionFragment,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isEnabled(): boolean {
    return Boolean(this.endpoint)
  }

  public get href() {
    if (!this.endpoint) {
      return ''
    }

    const baseUrl = `${this.baseUrl}/${this.organization.id}/${this.project.name}/${this.branch.name}`

    if (this.revision.isDraft) {
      return `${baseUrl}/draft`
    } else if (this.revision.isHead) {
      return `${baseUrl}/head`
    } else {
      return `${baseUrl}/${this.revision.id}`
    }
  }

  public async toggle() {
    try {
      if (this.endpoint) {
        await this.deleteEndpointRequest.fetch({
          data: {
            endpointId: this.endpoint.id,
          },
        })

        const foundIndex = this.revision.endpoints.findIndex((endpoint) => endpoint.id === this.endpoint?.id)

        if (foundIndex !== -1) {
          this.revision.endpoints.splice(foundIndex, 1)
        }
      } else {
        const result = await this.createEndpointRequest.fetch({
          data: {
            revisionId: this.revision.id,
            type: this.endpointType,
          },
        })

        if (result.isRight) {
          this.revision.endpoints.push({
            ...result.data.createEndpoint,
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  public init() {}

  public dispose() {}

  private get endpoint(): EndpointFragment | undefined {
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

  private get baseUrl() {
    if (this.endpointType === EndpointType.Graphql) {
      return `/${SANDBOX_ROUTE}`
    }

    return `${BASE_URL}/${URL_MAPPER[this.endpointType]}`
  }
}
