import { makeAutoObservable, runInAction } from 'mobx'
import { ForeignKeysByQuery, ForeignKeysByRowsQuery } from 'src/__generated__/graphql-request.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
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
  data: JsonValue
}

export class ForeignKeysByDataSource {
  private readonly tablesRequest = ObservableRequest.of(client.ForeignKeysBy)

  private _tables: ForeignKeyTableData[] = []
  private _isLoadingRows = false
  private _rowsError: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.tablesRequest.isLoading || this._isLoadingRows
  }

  public get error(): string | null {
    return this.tablesRequest.errorMessage ?? this._rowsError ?? null
  }

  public get tables(): ForeignKeyTableData[] {
    return this._tables
  }

  public async load(params: ForeignKeysByParams): Promise<boolean> {
    this._tables = []
    this._rowsError = null

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

    runInAction(() => {
      this._isLoadingRows = true
    })

    try {
      const rowsPromises = tableIds.map((foreignKeyTableId) => this.loadRowsForTable(params, foreignKeyTableId))

      const rowsResults = await Promise.all(rowsPromises)

      runInAction(() => {
        this._tables = rowsResults.filter((t): t is ForeignKeyTableData => t !== null)
        this._isLoadingRows = false
      })

      return true
    } catch (e) {
      runInAction(() => {
        this._rowsError = e instanceof Error ? e.message : 'Failed to load rows'
        this._isLoadingRows = false
      })
      return false
    }
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
    const result = await client.ForeignKeysByRows({
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

    return this.mapRowsData(foreignKeyTableId, result)
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
        data: edge.node.data as JsonValue,
      })),
      totalCount: connection.totalCount,
      hasNextPage: connection.pageInfo.hasNextPage,
      endCursor: connection.pageInfo.endCursor ?? null,
    }
  }

  public dispose(): void {
    this.tablesRequest.abort()
    this._tables = []
    this._isLoadingRows = false
    this._rowsError = null
  }
}

container.register(ForeignKeysByDataSource, () => new ForeignKeysByDataSource(), { scope: 'request' })
