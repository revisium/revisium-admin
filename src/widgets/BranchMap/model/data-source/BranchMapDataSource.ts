import { makeAutoObservable } from 'mobx'
import { RevisionMapBranchFullFragment, RevisionMapRevisionBaseFragment } from 'src/__generated__/graphql-request.ts'
import { container, isAborted } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { EndpointType, ProjectGraphBranch, ProjectGraphData, ProjectGraphRevision } from '../../lib/types.ts'

export class BranchMapDataSource {
  private readonly projectGraphRequest = ObservableRequest.of(client.getProjectGraph)

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.projectGraphRequest.isLoading
  }

  public get error(): string | null {
    return this.projectGraphRequest.errorMessage ?? null
  }

  public async loadProjectGraph(
    organizationId: string,
    projectName: string,
  ): Promise<{ data: ProjectGraphData | null; aborted: boolean }> {
    const result = await this.projectGraphRequest.fetch({
      data: {
        organizationId,
        projectName,
        first: 100,
      },
    })

    if (!result.isRight) {
      return { data: null, aborted: isAborted(result) }
    }

    const branches = result.data.branches.edges.map((edge) => this.mapBranchFull(edge.node))

    return {
      data: {
        projectName,
        branches,
      },
      aborted: false,
    }
  }

  public dispose(): void {
    this.projectGraphRequest.abort()
  }

  private mapBranchFull(branch: RevisionMapBranchFullFragment): ProjectGraphBranch {
    return {
      id: branch.id,
      name: branch.name,
      isRoot: branch.isRoot,
      touched: branch.touched,
      createdAt: branch.createdAt,
      parentBranchId: branch.parent?.branch?.id ?? null,
      parentBranchName: branch.parent?.branch?.name ?? null,
      parentRevision: branch.parent?.revision ? this.mapRevisionBase(branch.parent.revision) : null,
      startRevision: this.mapRevisionBase(branch.start),
      headRevision: this.mapRevisionBase(branch.head),
      draftRevision: this.mapRevisionBase(branch.draft),
      totalRevisionsCount: branch.revisions.totalCount,
    }
  }

  private mapRevisionBase(revision: RevisionMapRevisionBaseFragment): ProjectGraphRevision {
    return {
      id: revision.id,
      comment: revision.comment,
      isDraft: revision.isDraft,
      isHead: revision.isHead,
      isStart: revision.isStart,
      createdAt: revision.createdAt,
      parentId: revision.parent?.id ?? null,
      endpoints: revision.endpoints.map((e) => ({
        id: e.id,
        type: e.type as EndpointType,
        revisionId: revision.id,
        createdAt: e.createdAt,
      })),
      childBranchIds: revision.childBranches.map((cb) => cb.branch.id),
      childBranchNames: revision.childBranches.map((cb) => cb.branch.name),
    }
  }
}

container.register(BranchMapDataSource, () => new BranchMapDataSource(), { scope: 'request' })
