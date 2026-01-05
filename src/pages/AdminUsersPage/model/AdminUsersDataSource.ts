import { AdminUsersQuery, AdminUserItemFragment } from 'src/__generated__/graphql-request'
import { container } from 'src/shared/lib/DIContainer'
import { PaginatedListDataSource } from 'src/shared/lib/datasources/PaginatedListDataSource'
import { client } from 'src/shared/model/ApiService'

export interface AdminUsersFilters {
  search?: string
}

export class AdminUsersDataSource extends PaginatedListDataSource<
  AdminUserItemFragment,
  AdminUsersQuery,
  AdminUsersFilters
> {
  private currentFilters: AdminUsersFilters = {}

  constructor() {
    super(client.adminUsers, { pageSize: 50 })
  }

  protected extractItems(response: AdminUsersQuery): AdminUserItemFragment[] {
    return response.adminUsers.edges.map((edge) => edge.node)
  }

  protected extractPageInfo(response: AdminUsersQuery) {
    return {
      hasNextPage: response.adminUsers.pageInfo.hasNextPage,
      endCursor: response.adminUsers.pageInfo.endCursor || null,
      totalCount: response.adminUsers.totalCount,
    }
  }

  protected buildFetchArgs(filters?: AdminUsersFilters, cursor?: string) {
    if (filters) {
      this.currentFilters = filters
    }

    return {
      first: this.config.pageSize,
      after: cursor,
      search: this.currentFilters.search || undefined,
    }
  }
}

container.register(AdminUsersDataSource, () => new AdminUsersDataSource(), { scope: 'request' })
