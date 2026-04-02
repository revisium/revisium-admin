import { OrganizationProjectItemFragment, OrganizationProjectsQuery } from 'src/__generated__/graphql-request.ts'
import { OrganizationContext } from 'src/entities/Organization/model/OrganizationContext.ts'
import { container } from 'src/shared/lib/DIContainer.ts'
import { PaginatedListDataSource } from 'src/shared/lib/datasources/PaginatedListDataSource.ts'
import { client } from 'src/shared/model/ApiService.ts'

export class OrganizationProjectsDataSource extends PaginatedListDataSource<
  OrganizationProjectItemFragment,
  OrganizationProjectsQuery
> {
  constructor(private readonly context: OrganizationContext) {
    super(client.organizationProjects, { pageSize: 100 })
  }

  protected extractItems(response: OrganizationProjectsQuery): OrganizationProjectItemFragment[] {
    return response.projects.edges.map((edge) => edge.node)
  }

  protected extractPageInfo(response: OrganizationProjectsQuery) {
    return {
      hasNextPage: response.projects.pageInfo.hasNextPage,
      endCursor: response.projects.pageInfo.endCursor || null,
      totalCount: response.projects.totalCount,
    }
  }

  protected buildFetchArgs(_filters?: void, cursor?: string) {
    return {
      data: {
        organizationId: this.context.organizationId,
        first: this.config.pageSize,
        after: cursor,
      },
    }
  }
}

container.register(
  OrganizationProjectsDataSource,
  () => {
    const context = container.get(OrganizationContext)
    return new OrganizationProjectsDataSource(context)
  },
  { scope: 'request' },
)
