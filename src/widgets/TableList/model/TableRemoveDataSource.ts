import { makeAutoObservable } from 'mobx'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

export interface TableRemoveParams {
  revisionId: string
  tableId: string
}

export class TableRemoveDataSource {
  private readonly request = ObservableRequest.of(client.removeTableForList)

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.request.isLoading
  }

  public get error(): string | null {
    return this.request.errorMessage ?? null
  }

  public async remove(params: TableRemoveParams): Promise<boolean> {
    const result = await this.request.fetch({
      data: {
        revisionId: params.revisionId,
        tableId: params.tableId,
      },
    })

    return result.isRight
  }

  public dispose(): void {
    this.request.abort()
  }
}

container.register(TableRemoveDataSource, () => new TableRemoveDataSource(), { scope: 'request' })
