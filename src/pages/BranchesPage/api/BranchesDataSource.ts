import { action, computed, makeObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { BranchItemFragment, GetProjectBranchesQuery } from 'src/__generated__/graphql-request.ts'
import { container, ObservableRequest } from 'src/shared/lib'
import { PaginatedListDataSource } from 'src/shared/lib/datasources/PaginatedListDataSource.ts'
import { client } from 'src/shared/model/ApiService.ts'

export class BranchesDataSource extends PaginatedListDataSource<BranchItemFragment, GetProjectBranchesQuery> {
  private readonly deleteBranchRequest = ObservableRequest.of(client.deleteBranch)

  constructor(private readonly context: ProjectContext) {
    super(client.getProjectBranches, { pageSize: 100 })
    makeObservable(this, {
      isDeleting: computed,
      deleteBranch: action,
      reload: action,
    })
  }

  protected extractItems(response: GetProjectBranchesQuery): BranchItemFragment[] {
    return response.branches.edges.map((edge) => edge.node)
  }

  protected extractPageInfo(response: GetProjectBranchesQuery) {
    return {
      hasNextPage: response.branches.pageInfo.hasNextPage,
      endCursor: response.branches.pageInfo.endCursor || null,
      totalCount: response.branches.totalCount,
    }
  }

  protected buildFetchArgs(_filters?: void, cursor?: string) {
    return {
      data: {
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
        first: this.config.pageSize,
        after: cursor,
      },
    }
  }

  public async deleteBranch(branchName: string): Promise<boolean> {
    const result = await this.deleteBranchRequest.fetch({
      data: {
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
        branchName,
      },
    })

    if (result.isRight) {
      return result.data.deleteBranch
    }

    return false
  }

  public get isDeleting(): boolean {
    return this.deleteBranchRequest.isLoading
  }

  public async reload(): Promise<void> {
    this.reset()
    await this.load()
  }

  public override dispose(): void {
    super.dispose()
    this.deleteBranchRequest.abort()
  }
}

container.register(
  BranchesDataSource,
  () => {
    const context = container.get(ProjectContext)
    return new BranchesDataSource(context)
  },
  { scope: 'request' },
)
