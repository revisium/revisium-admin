import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { RevisionForSelectFragment } from 'src/__generated__/graphql-request.ts'
import { container, ObservableRequest } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'

export interface BranchForSelect {
  id: string
  name: string
  isRoot: boolean
}

export interface RevisionForSelect {
  id: string
  isDraft: boolean
  isHead: boolean
  createdAt: string
  comment: string | null
}

export class CreateBranchDataSource {
  private readonly getBranchesRequest = ObservableRequest.of(client.getBranchesForSelect)
  private readonly getRevisionsRequest = ObservableRequest.of(client.getBranchRevisionsForCreate)
  private readonly createBranchRequest = ObservableRequest.of(client.createBranch)

  constructor(private readonly context: ProjectContext) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoadingBranches(): boolean {
    return this.getBranchesRequest.isLoading
  }

  public get isLoadingRevisions(): boolean {
    return this.getRevisionsRequest.isLoading
  }

  public get isCreating(): boolean {
    return this.createBranchRequest.isLoading
  }

  public async getBranches(): Promise<BranchForSelect[]> {
    const result = await this.getBranchesRequest.fetch({
      data: {
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
        first: 100,
      },
    })

    if (result.isRight) {
      return result.data.branches.edges.map((edge) => edge.node)
    }

    return []
  }

  public async getRevisions(branchName: string): Promise<RevisionForSelect[]> {
    const result = await this.getRevisionsRequest.fetch({
      data: {
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
        branchName,
      },
      revisionsData: {
        first: 100,
      },
    })

    if (result.isRight) {
      return result.data.branch.revisions.edges
        .map((edge) => this.mapRevision(edge.node))
        .filter((revision) => !revision.isDraft)
    }

    return []
  }

  public async createBranch(revisionId: string, branchName: string): Promise<boolean> {
    const result = await this.createBranchRequest.fetch({
      data: {
        revisionId,
        branchName,
      },
    })

    return result.isRight
  }

  private mapRevision(revision: RevisionForSelectFragment): RevisionForSelect {
    return {
      id: revision.id,
      isDraft: revision.isDraft,
      isHead: revision.isHead,
      createdAt: revision.createdAt,
      comment: revision.comment ?? null,
    }
  }

  public dispose(): void {
    this.getBranchesRequest.abort()
    this.getRevisionsRequest.abort()
    this.createBranchRequest.abort()
  }
}

container.register(
  CreateBranchDataSource,
  () => {
    const context = container.get(ProjectContext)
    return new CreateBranchDataSource(context)
  },
  { scope: 'request' },
)
