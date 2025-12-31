import { MeProjectListItemFragment, MeProjectsListQuery } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib/DIContainer.ts'
import { PaginatedListDataSource } from 'src/shared/lib/datasources/PaginatedListDataSource.ts'
import { client } from 'src/shared/model/ApiService.ts'

export class MeProjectsDataSource extends PaginatedListDataSource<MeProjectListItemFragment, MeProjectsListQuery> {
  constructor() {
    super(client.meProjectsList, { pageSize: 100 })
  }

  protected extractItems(response: MeProjectsListQuery): MeProjectListItemFragment[] {
    return response.meProjects.edges.map((edge) => edge.node)
  }

  protected extractPageInfo(response: MeProjectsListQuery) {
    return {
      hasNextPage: response.meProjects.pageInfo.hasNextPage,
      endCursor: response.meProjects.pageInfo.endCursor || null,
      totalCount: response.meProjects.totalCount,
    }
  }

  protected buildFetchArgs(_filters?: void, cursor?: string) {
    return {
      data: {
        first: this.config.pageSize,
        after: cursor,
      },
    }
  }
}

container.register(
  MeProjectsDataSource,
  () => {
    return new MeProjectsDataSource()
  },
  { scope: 'request' },
)
