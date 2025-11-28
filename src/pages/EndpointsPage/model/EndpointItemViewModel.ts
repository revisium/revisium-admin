import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { getEnv } from 'src/shared/env/getEnv.ts'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { EndpointType, GetProjectEndpointsQuery } from 'src/__generated__/graphql-request'

const ENDPOINT_SERVER_URL = getEnv('REACT_APP_ENDPOINT_SERVER_URL')

export type EndpointItem = GetProjectEndpointsQuery['projectEndpoints']['edges'][number]['node']

export class EndpointItemViewModel {
  private readonly deleteEndpointRequest = ObservableRequest.of(client.deleteEndpoint)

  constructor(
    private readonly context: ProjectContext,
    public readonly item: EndpointItem,
    private readonly onDeleted: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get id(): string {
    return this.item.id
  }

  public get type(): EndpointType {
    return this.item.type
  }

  public get typeLabel(): string {
    return this.item.type === EndpointType.Graphql ? 'GraphQL' : 'REST API'
  }

  public get branchName(): string {
    return this.item.revision.branch.name
  }

  public get revisionTag(): string {
    if (this.item.revision.isDraft) {
      return 'draft'
    }
    if (this.item.revision.isHead) {
      return 'head'
    }
    return this.item.revision.id.slice(0, 8)
  }

  public get endpointUrl(): string {
    const baseUrl = this.systemApiUrl
    const orgId = this.context.project.organization.id
    const projectName = this.context.project.name
    const branchName = this.branchName
    const revisionTag = this.revisionTag

    if (this.item.type === EndpointType.Graphql) {
      return `${baseUrl}/graphql/${orgId}/${projectName}/${branchName}/${revisionTag}`
    }

    return `${baseUrl}/api/${orgId}/${projectName}/${branchName}/${revisionTag}`
  }

  public get sandboxUrl(): string {
    const orgId = this.context.project.organization.id
    const projectName = this.context.project.name
    const branchName = this.branchName
    const revisionTag = this.revisionTag
    return `/sandbox/${orgId}/${projectName}/${branchName}/${revisionTag}`
  }

  public get linkUrl(): string {
    return this.item.type === EndpointType.Graphql ? this.sandboxUrl : this.endpointUrl
  }

  public copyUrl(): void {
    void navigator.clipboard.writeText(this.endpointUrl)
  }

  public open(): void {
    window.open(this.linkUrl, '_blank')
  }

  public async delete(): Promise<void> {
    try {
      const result = await this.deleteEndpointRequest.fetch({
        data: {
          endpointId: this.item.id,
        },
      })

      if (result.isRight) {
        this.onDeleted()
      }
    } catch (e) {
      console.error(e)
    }
  }

  private get systemApiUrl(): string {
    return ENDPOINT_SERVER_URL || window.location.origin
  }
}
