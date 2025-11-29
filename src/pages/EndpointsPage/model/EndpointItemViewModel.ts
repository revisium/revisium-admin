import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { DRAFT_TAG, HEAD_TAG, SANDBOX_ROUTE } from 'src/shared/config/routes.ts'
import { getEnv } from 'src/shared/env/getEnv.ts'
import { copyToClipboard, getOrigin } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { EndpointFragment, EndpointType } from 'src/__generated__/graphql-request'

const ENDPOINT_SERVER_URL = getEnv('REACT_APP_ENDPOINT_SERVER_URL')

export class EndpointItemViewModel {
  private readonly deleteEndpointRequest = ObservableRequest.of(client.deleteEndpoint)

  constructor(
    private readonly context: ProjectContext,
    public readonly item: EndpointFragment,
    private readonly onDeleted: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get id(): string {
    return this.item.id
  }

  public get typeLabel(): string {
    return this.item.type === EndpointType.Graphql ? 'GraphQL' : 'REST API'
  }

  public get branchName(): string {
    return this.item.revision.branch.name
  }

  public get revisionTag(): string {
    if (this.item.revision.isDraft) {
      return DRAFT_TAG
    }
    if (this.item.revision.isHead) {
      return HEAD_TAG
    }
    return this.item.revision.id.slice(0, 8)
  }

  public get endpointUrl(): string {
    const baseUrl = `${getOrigin()}${ENDPOINT_SERVER_URL}`
    const apiType = this.item.type === EndpointType.Graphql ? 'graphql' : 'api'
    return `${baseUrl}/${apiType}/${this.pathSegment}`
  }

  public get isGraphql(): boolean {
    return this.item.type === EndpointType.Graphql
  }

  public get sandboxUrl() {
    if (this.isGraphql) {
      return `${getOrigin()}/${SANDBOX_ROUTE}/${this.pathSegment}`
    }

    return undefined
  }

  public copyUrl(): void {
    void copyToClipboard(this.endpointUrl)
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

  private get pathSegment(): string {
    const orgId = this.context.project.organization.id
    const projectName = this.context.project.name
    return `${orgId}/${projectName}/${this.branchName}/${this.revisionTag}`
  }
}
