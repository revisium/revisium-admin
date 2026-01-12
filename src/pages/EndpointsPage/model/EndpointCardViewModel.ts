import { makeAutoObservable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container, copyToClipboard } from 'src/shared/lib'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { EndpointType } from 'src/__generated__/graphql-request'
import { EndpointsDataSource } from '../api/EndpointsDataSource.ts'
import { EndpointUrlBuilder, EndpointUrls } from '../lib/EndpointUrlBuilder.ts'

export type RevisionType = 'draft' | 'head'

export interface EndpointCardData {
  branchId: string
  branchName: string
  isRootBranch: boolean
  revisionId: string
  revisionType: RevisionType
  endpointType: EndpointType
  endpointId: string | null
}

export interface EndpointCardDependencies {
  urlBuilder: EndpointUrlBuilder
  copyToClipboard: (text: string) => Promise<void>
}

const defaultDependencies: EndpointCardDependencies = {
  urlBuilder: new EndpointUrlBuilder(),
  copyToClipboard,
}

export type EndpointCardViewModelFactoryFn = (data: EndpointCardData, onChanged: () => void) => EndpointCardViewModel

export class EndpointCardViewModelFactory {
  constructor(public readonly create: EndpointCardViewModelFactoryFn) {}
}

export class EndpointCardViewModel {
  private _isCreating = false
  private _isDeleting = false
  private _endpointId: string | null
  private readonly urls: EndpointUrls

  constructor(
    context: ProjectContext,
    private readonly projectPermissions: ProjectPermissions,
    private readonly dataSource: EndpointsDataSource,
    private readonly data: EndpointCardData,
    private readonly onChanged: () => void,
    private readonly deps: EndpointCardDependencies = defaultDependencies,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this._endpointId = data.endpointId
    this.urls = this.deps.urlBuilder.buildDraftHeadUrls(
      context.organizationId,
      context.projectName,
      data.branchName,
      data.revisionType,
      data.endpointType,
    )
  }

  public get branchId(): string {
    return this.data.branchId
  }

  public get branchName(): string {
    return this.data.branchName
  }

  public get isRootBranch(): boolean {
    return this.data.isRootBranch
  }

  public get revisionType(): RevisionType {
    return this.data.revisionType
  }

  public get revisionLabel(): string {
    return this.data.revisionType === 'draft' ? 'Draft' : 'Head'
  }

  public get endpointType(): EndpointType {
    return this.data.endpointType
  }

  public get endpointTypeLabel(): string {
    return this.data.endpointType === EndpointType.Graphql ? 'GraphQL' : 'REST API'
  }

  public get isEnabled(): boolean {
    return this._endpointId !== null
  }

  public get isCreating(): boolean {
    return this._isCreating
  }

  public get isDeleting(): boolean {
    return this._isDeleting
  }

  public get isLoading(): boolean {
    return this._isCreating || this._isDeleting
  }

  public get canCreate(): boolean {
    return this.projectPermissions.canCreateEndpoint
  }

  public get canDelete(): boolean {
    return this.projectPermissions.canDeleteEndpoint
  }

  public get graphqlUrl(): string {
    return this.urls.graphql
  }

  public get openApiUrl(): string {
    return this.urls.openApi
  }

  public get sandboxUrl(): string | undefined {
    return this.urls.sandbox
  }

  public get swaggerUrl(): string | undefined {
    return this.urls.swagger
  }

  public get copyableUrl(): string {
    return this.urls.copyable
  }

  public get copyTooltip(): string {
    if (this.data.endpointType === EndpointType.Graphql) {
      return 'Copy GraphQL URL'
    }
    return 'Copy OpenAPI URL'
  }

  public copyUrl(): void {
    void this.deps.copyToClipboard(this.copyableUrl)
  }

  public async enable(): Promise<void> {
    if (this._isCreating || this._endpointId) {
      return
    }

    this._isCreating = true

    try {
      const endpoint = await this.dataSource.createEndpoint({
        revisionId: this.data.revisionId,
        type: this.data.endpointType,
      })

      runInAction(() => {
        if (endpoint) {
          this._endpointId = endpoint.id
          this.onChanged()
        }
      })
    } finally {
      runInAction(() => {
        this._isCreating = false
      })
    }
  }

  public async disable(): Promise<void> {
    if (this._isDeleting || !this._endpointId) {
      return
    }

    this._isDeleting = true

    try {
      const success = await this.dataSource.deleteEndpoint(this._endpointId)

      runInAction(() => {
        if (success) {
          this._endpointId = null
          this.onChanged()
        }
      })
    } finally {
      runInAction(() => {
        this._isDeleting = false
      })
    }
  }

  public async toggle(): Promise<void> {
    if (this._endpointId) {
      await this.disable()
    } else {
      await this.enable()
    }
  }
}

container.register(
  EndpointCardViewModelFactory,
  () => {
    return new EndpointCardViewModelFactory((data, onChanged) => {
      const context = container.get(ProjectContext)
      const projectPermissions = container.get(ProjectPermissions)
      const dataSource = container.get(EndpointsDataSource)
      return new EndpointCardViewModel(context, projectPermissions, dataSource, data, onChanged)
    })
  },
  { scope: 'request' },
)
