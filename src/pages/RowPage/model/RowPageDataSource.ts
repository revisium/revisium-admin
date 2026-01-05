import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

export interface RowPageParams {
  revisionId: string
  tableId: string
  rowId: string
}

export class RowPageDataSource {
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

  public get row() {
    return this.request.data?.row ?? null
  }

  public get table() {
    return this.request.data?.table ?? null
  }

  public get foreignKeysCount(): number {
    return this.request.data?.getRowCountForeignKeysTo ?? 0
  }

  public async load(params: RowPageParams): Promise<boolean> {
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

    return result.isRight
  }

  public dispose(): void {
    this.request.abort()
  }
}

container.register(RowPageDataSource, () => new RowPageDataSource(), { scope: 'request' })
