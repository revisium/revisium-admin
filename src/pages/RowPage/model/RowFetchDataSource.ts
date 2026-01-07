import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { JsonObjectSchema } from 'src/entities/Schema'

export interface RowFetchParams {
  revisionId: string
  tableId: string
  rowId: string
}

export interface RowFetchResult {
  rowId: string
  data: JsonValue
  schema: JsonObjectSchema
  foreignKeysCount: number
}

export class RowFetchDataSource {
  private readonly request = ObservableRequest.of(client.rowPageData)

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.request.isLoading
  }

  public get error(): string | null {
    return this.request.errorMessage ?? null
  }

  public async fetch(params: RowFetchParams): Promise<RowFetchResult | null> {
    const result = await this.request.fetch({
      rowData: {
        revisionId: params.revisionId,
        tableId: params.tableId,
        rowId: params.rowId,
      },
      tableData: {
        revisionId: params.revisionId,
        tableId: params.tableId,
      },
      foreignKeysData: {
        revisionId: params.revisionId,
        tableId: params.tableId,
        rowId: params.rowId,
      },
    })

    if (result.isRight && result.data.row && result.data.table) {
      return {
        rowId: result.data.row.id,
        data: result.data.row.data as JsonValue,
        schema: result.data.table.schema as JsonObjectSchema,
        foreignKeysCount: result.data.getRowCountForeignKeysTo ?? 0,
      }
    }

    return null
  }

  public dispose(): void {
    this.request.abort()
  }
}

container.register(RowFetchDataSource, () => new RowFetchDataSource(), { scope: 'request' })
