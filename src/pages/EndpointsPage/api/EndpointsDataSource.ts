import { makeAutoObservable, runInAction } from 'mobx'
import { container, isAborted, ObservableRequest } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'
import {
  CreateEndpointMutation,
  EndpointBranchFragment,
  EndpointFragment,
  EndpointType,
} from 'src/__generated__/graphql-request'

export interface CreateEndpointInput {
  revisionId: string
  type: EndpointType
}

export interface GetEndpointsInput {
  organizationId: string
  projectName: string
  branchId?: string
  type?: EndpointType
  first: number
  after?: string
}

export interface EndpointsResult {
  items: EndpointFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
}

export interface BranchWithRevisions {
  id: string
  name: string
  isRoot: boolean
  headRevisionId: string
  draftRevisionId: string
}

export class EndpointsDataSource {
  private readonly getEndpointsRequest = ObservableRequest.of(client.getProjectEndpoints, {
    skipResetting: true,
  })
  private readonly getBranchesRequest = ObservableRequest.of(client.getEndpointBranches)
  private readonly createEndpointRequest = ObservableRequest.of(client.createEndpoint)
  private readonly deleteEndpointRequest = ObservableRequest.of(client.deleteEndpoint)

  private _wasAborted = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoadingEndpoints(): boolean {
    return this.getEndpointsRequest.isLoading
  }

  public get isLoadingBranches(): boolean {
    return this.getBranchesRequest.isLoading
  }

  public get error(): string | null {
    return this.getEndpointsRequest.errorMessage ?? this.getBranchesRequest.errorMessage ?? null
  }

  public get wasAborted(): boolean {
    return this._wasAborted
  }

  public async getBranches(organizationId: string, projectName: string): Promise<BranchWithRevisions[] | null> {
    this._wasAborted = false

    const result = await this.getBranchesRequest.fetch({
      data: {
        organizationId,
        projectName,
        first: 100,
      },
    })

    if (!result.isRight) {
      if (isAborted(result)) {
        runInAction(() => {
          this._wasAborted = true
        })
      }
      return null
    }

    return result.data.branches.edges.map((edge): BranchWithRevisions => {
      const node: EndpointBranchFragment = edge.node
      return {
        id: node.id,
        name: node.name,
        isRoot: node.isRoot,
        headRevisionId: node.head.id,
        draftRevisionId: node.draft.id,
      }
    })
  }

  public async getEndpoints(input: GetEndpointsInput): Promise<EndpointsResult | null> {
    this._wasAborted = false

    const result = await this.getEndpointsRequest.fetch({
      organizationId: input.organizationId,
      projectName: input.projectName,
      first: input.first,
      after: input.after,
      branchId: input.branchId,
      type: input.type,
    })

    if (!result.isRight) {
      if (isAborted(result)) {
        runInAction(() => {
          this._wasAborted = true
        })
      }
      return null
    }

    return {
      items: result.data.projectEndpoints.edges.map((edge) => edge.node),
      hasNextPage: result.data.projectEndpoints.pageInfo.hasNextPage,
      endCursor: result.data.projectEndpoints.pageInfo.endCursor ?? null,
      totalCount: result.data.projectEndpoints.totalCount,
    }
  }

  public async createEndpoint(input: CreateEndpointInput): Promise<CreateEndpointMutation['createEndpoint'] | null> {
    const result = await this.createEndpointRequest.fetch({
      data: {
        revisionId: input.revisionId,
        type: input.type,
      },
    })

    if (result.isRight) {
      return result.data.createEndpoint
    }

    return null
  }

  public async deleteEndpoint(endpointId: string): Promise<boolean> {
    const result = await this.deleteEndpointRequest.fetch({
      data: {
        endpointId,
      },
    })

    return result.isRight
  }

  public dispose(): void {
    this.getEndpointsRequest.abort()
    this.getBranchesRequest.abort()
    this.createEndpointRequest.abort()
    this.deleteEndpointRequest.abort()
  }
}

container.register(EndpointsDataSource, () => new EndpointsDataSource(), { scope: 'request' })
