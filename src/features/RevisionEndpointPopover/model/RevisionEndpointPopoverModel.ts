import { makeAutoObservable } from 'mobx'
import { EndpointType } from 'src/__generated__/graphql-request.ts'
import { RevisionFragment } from 'src/features/RevisionEndpointPopover/config/types.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { RevisionEndpointItemModel } from './RevisionEndpointItemModel.ts'

export class RevisionEndpointPopoverModel {
  public graphqlItem: RevisionEndpointItemModel | null = null
  public restApiItem: RevisionEndpointItemModel | null = null

  constructor(
    private readonly projectPageModel: ProjectPageModel,
    public readonly revision: RevisionFragment,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get hasEndpoints(): boolean {
    return Boolean(this.graphqlItem?.isEnabled || this.restApiItem?.isEnabled)
  }

  public get revisionTitle(): string {
    return `Revision ${this.revision.id.slice(0, 8)}`
  }

  public init() {
    this.graphqlItem = new RevisionEndpointItemModel(this.projectPageModel, EndpointType.Graphql, this.revision)
    this.graphqlItem.init()

    this.restApiItem = new RevisionEndpointItemModel(this.projectPageModel, EndpointType.RestApi, this.revision)
    this.restApiItem.init()
  }

  public dispose() {
    this.graphqlItem?.dispose()
    this.restApiItem?.dispose()
    this.graphqlItem = null
    this.restApiItem = null
  }
}
