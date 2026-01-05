import { makeAutoObservable, runInAction } from 'mobx'
import { ForeignKeysByQuery, ForeignKeysByRowsQuery } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

export interface ForeignKeysByParams {
  revisionId: string
  tableId: string
  rowId: string
}

export interface ForeignKeyTableData {
  tableId: string
  rows: ForeignKeyRowData[]
  totalCount: number
  hasNextPage: boolean
  endCursor: string | null
}

export interface ForeignKeyRowData {
  id: string
  versionId: string
  data: unknown
}

export class ForeignKeysByDataSource {
  private readonly tablesRequest = ObservableRequest.of(client.ForeignKeysBy)
  private readonly rowsRequest = ObservableRequest.of(client.ForeignKeysByRows)

  private _tables: ForeignKeyTableData[] = []

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.tablesRequest.isLoading || this.rowsRequest.isLoading
  }

  public get error(): string | null {
    return this.tablesRequest.errorMessage ?? this.rowsRequest.errorMessage ?? null
  }

  public get tables(): ForeignKeyTableData[] {
    return this._tables
  }

  public async load(params: ForeignKeysByParams): Promise<boolean> {
    this._tables = []

    const tablesResult = await this.tablesRequest.fetch({
      tableData: {
        revisionId: params.revisionId,
        tableId: params.tableId,
      },
      foreignKeyTablesData: {
        first: 100,
      },
    })

    if (!tablesResult.isRight) {
      return false
    }

    const tableIds = this.extractTableIds(tablesResult.data)

    if (tableIds.length === 0) {
      return true
    }

    const rowsPromises = tableIds.map((foreignKeyTableId) => this.loadRowsForTable(params, foreignKeyTableId))

    const rowsResults = await Promise.all(rowsPromises)

    runInAction(() => {
      this._tables = rowsResults.filter((t): t is ForeignKeyTableData => t !== null)
    })

    return true
  }

  private extractTableIds(data: ForeignKeysByQuery): string[] {
    if (!data.table) {
      return []
    }
    return data.table.foreignKeysBy.edges.map((edge) => edge.node.id)
  }

  private async loadRowsForTable(
    params: ForeignKeysByParams,
    foreignKeyTableId: string,
  ): Promise<ForeignKeyTableData | null> {
    const result = await this.rowsRequest.fetch({
      rowData: {
        revisionId: params.revisionId,
        tableId: params.tableId,
        rowId: params.rowId,
      },
      foreignKeyRowsData: {
        first: 100,
        foreignKeyTableId,
      },
    })

    if (!result.isRight) {
      return null
    }

    return this.mapRowsData(foreignKeyTableId, result.data)
  }

  private mapRowsData(tableId: string, data: ForeignKeysByRowsQuery): ForeignKeyTableData | null {
    if (!data.row) {
      return null
    }
    const connection = data.row.rowForeignKeysBy

    return {
      tableId,
      rows: connection.edges.map((edge) => ({
        id: edge.node.id,
        versionId: edge.node.versionId,
        data: edge.node.data,
      })),
      totalCount: connection.totalCount,
      hasNextPage: connection.pageInfo.hasNextPage,
      endCursor: connection.pageInfo.endCursor ?? null,
    }
  }

  public dispose(): void {
    this.tablesRequest.abort()
    this.rowsRequest.abort()
    this._tables = []
  }
}

container.register(ForeignKeysByDataSource, () => new ForeignKeysByDataSource(), { scope: 'request' })
