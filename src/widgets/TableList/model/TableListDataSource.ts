import { TableListDataQuery, TableListItemFragment } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { PaginatedListDataSource } from 'src/shared/lib/datasources/PaginatedListDataSource.ts'
import { client } from 'src/shared/model/ApiService.ts'

export interface TableListFilters {
  revisionId: string
}

export class TableListDataSource extends PaginatedListDataSource<
  TableListItemFragment,
  TableListDataQuery,
  TableListFilters
> {
  private _filters: TableListFilters | null = null

  constructor() {
    super(client.tableListData, { pageSize: 50 })
  }

  protected extractItems(response: TableListDataQuery): TableListItemFragment[] {
    return response.tables.edges.map((edge) => edge.node)
  }

  protected extractPageInfo(response: TableListDataQuery): {
    hasNextPage: boolean
    endCursor: string | null
    totalCount: number
  } {
    return {
      hasNextPage: response.tables.pageInfo.hasNextPage,
      endCursor: response.tables.pageInfo.endCursor ?? null,
      totalCount: response.tables.totalCount,
    }
  }

  protected buildFetchArgs(filters?: TableListFilters, cursor?: string) {
    const revisionId = filters?.revisionId ?? this._filters?.revisionId ?? ''

    if (filters) {
      this._filters = filters
    }

    return {
      data: {
        revisionId,
        first: this.config.pageSize,
        after: cursor,
      },
    }
  }
}

container.register(TableListDataSource, () => new TableListDataSource(), { scope: 'request' })
