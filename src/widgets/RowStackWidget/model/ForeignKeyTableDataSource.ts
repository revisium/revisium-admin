import { makeAutoObservable } from 'mobx'
import { ForeignKeyRowItemFragment, ForeignKeyTableItemFragment } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

export interface ForeignKeyTableWithRows {
  table: ForeignKeyTableItemFragment
  rows: ForeignKeyRowItemFragment[]
  totalCount: number
  hasNextPage: boolean
  endCursor: string | null
}

export class ForeignKeyTableDataSource {
  private readonly request = ObservableRequest.of(client.foreignKeyTableWithRows)

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.request.isLoading
  }

  public get error(): string | null {
    return this.request.errorMessage ?? null
  }

  public async loadTableWithRows(
    revisionId: string,
    tableId: string,
    first: number = 50,
  ): Promise<ForeignKeyTableWithRows | null> {
    const result = await this.request.fetch({
      tableData: {
        revisionId,
        tableId,
      },
      rowsData: {
        revisionId,
        tableId,
        first,
      },
    })

    if (result.isRight && result.data.table && result.data.rows) {
      return {
        table: result.data.table,
        rows: result.data.rows.edges.map((edge) => edge.node),
        totalCount: result.data.rows.totalCount,
        hasNextPage: result.data.rows.pageInfo.hasNextPage,
        endCursor: result.data.rows.pageInfo.endCursor ?? null,
      }
    }

    return null
  }

  public dispose(): void {
    this.request.abort()
  }
}

container.register(ForeignKeyTableDataSource, () => new ForeignKeyTableDataSource(), { scope: 'request' })
