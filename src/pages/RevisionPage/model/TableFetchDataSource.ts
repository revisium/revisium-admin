import { makeAutoObservable } from 'mobx'
import { FetchTableForStackQuery } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

export interface TableFetchParams {
  revisionId: string
  tableId: string
}

export type TableFetchResult = NonNullable<FetchTableForStackQuery['table']>

export class TableFetchDataSource {
  private readonly request = ObservableRequest.of(client.fetchTableForStack)

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.request.isLoading
  }

  public get error(): string | null {
    return this.request.errorMessage ?? null
  }

  public async fetch(params: TableFetchParams): Promise<TableFetchResult | null> {
    const result = await this.request.fetch({
      data: {
        revisionId: params.revisionId,
        tableId: params.tableId,
      },
    })

    if (result.isRight && result.data.table) {
      return result.data.table
    }

    return null
  }

  public dispose(): void {
    this.request.abort()
  }
}

container.register(TableFetchDataSource, () => new TableFetchDataSource(), { scope: 'request' })
