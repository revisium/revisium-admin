import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container, copyToClipboard } from 'src/shared/lib'
import { EndpointFragment, EndpointType } from 'src/__generated__/graphql-request'
import { EndpointUrlBuilder, EndpointUrls } from '../lib/EndpointUrlBuilder.ts'

export interface CustomEndpointCardDependencies {
  urlBuilder: EndpointUrlBuilder
  copyToClipboard: (text: string) => Promise<void>
}

const defaultDependencies: CustomEndpointCardDependencies = {
  urlBuilder: new EndpointUrlBuilder(),
  copyToClipboard,
}

export type CustomEndpointCardViewModelFactoryFn = (endpoint: EndpointFragment) => CustomEndpointCardViewModel

export class CustomEndpointCardViewModelFactory {
  constructor(public readonly create: CustomEndpointCardViewModelFactoryFn) {}
}

export class CustomEndpointCardViewModel {
  private readonly urls: EndpointUrls

  constructor(
    private readonly endpoint: EndpointFragment,
    organizationId: string,
    projectName: string,
    private readonly deps: CustomEndpointCardDependencies = defaultDependencies,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.urls = this.deps.urlBuilder.buildCustomRevisionUrls(
      organizationId,
      projectName,
      endpoint.revision.branch.name,
      endpoint.revisionId,
      endpoint.type,
    )
  }

  public get id(): string {
    return this.endpoint.id
  }

  public get branchName(): string {
    return this.endpoint.revision.branch.name
  }

  public get revisionId(): string {
    return this.endpoint.revisionId
  }

  public get revisionLabel(): string {
    return `${this.branchName} / ${this.revisionId.substring(0, 8)}`
  }

  public get isGraphql(): boolean {
    return this.endpoint.type === EndpointType.Graphql
  }

  public get copyTooltip(): string {
    return this.isGraphql ? 'Copy GraphQL URL' : 'Copy OpenAPI URL'
  }

  public get copyableUrl(): string {
    return this.urls.copyable
  }

  public get sandboxUrl(): string | undefined {
    return this.urls.sandbox
  }

  public get swaggerUrl(): string | undefined {
    return this.urls.swagger
  }

  public copyUrl(): void {
    void this.deps.copyToClipboard(this.urls.copyable)
  }
}

container.register(
  CustomEndpointCardViewModelFactory,
  () => {
    const context = container.get(ProjectContext)

    return new CustomEndpointCardViewModelFactory(
      (endpoint) => new CustomEndpointCardViewModel(endpoint, context.organizationId, context.projectName),
    )
  },
  { scope: 'request' },
)
