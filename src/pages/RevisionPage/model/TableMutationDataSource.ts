import { makeAutoObservable } from 'mobx'
import {
  CreateTableForStackMutation,
  RenameTableForStackMutation,
  UpdateTableForStackMutation,
} from 'src/__generated__/graphql-request.ts'
import { JsonSchema } from 'src/entities/Schema'
import { JsonPatch } from 'src/entities/Schema/types/json-patch.types.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

export interface CreateTableParams {
  revisionId: string
  tableId: string
  schema: JsonSchema
}

export interface UpdateTableParams {
  revisionId: string
  tableId: string
  patches: JsonPatch[]
}

export interface RenameTableParams {
  revisionId: string
  tableId: string
  nextTableId: string
}

export type CreateTableResult = CreateTableForStackMutation['createTable']
export type UpdateTableResult = UpdateTableForStackMutation['updateTable']
export type RenameTableResult = RenameTableForStackMutation['renameTable']

export class TableMutationDataSource {
  private readonly createRequest = ObservableRequest.of(client.createTableForStack)
  private readonly updateRequest = ObservableRequest.of(client.updateTableForStack)
  private readonly renameRequest = ObservableRequest.of(client.renameTableForStack)

  constructor() {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.createRequest.isLoading || this.updateRequest.isLoading || this.renameRequest.isLoading
  }

  public get error(): string | null {
    return this.createRequest.errorMessage ?? this.updateRequest.errorMessage ?? this.renameRequest.errorMessage ?? null
  }

  public async createTable(params: CreateTableParams): Promise<CreateTableResult | null> {
    const result = await this.createRequest.fetch({
      data: {
        revisionId: params.revisionId,
        tableId: params.tableId,
        schema: params.schema,
      },
    })

    if (result.isRight) {
      return result.data.createTable
    }

    return null
  }

  public async updateTable(params: UpdateTableParams): Promise<UpdateTableResult | null> {
    const result = await this.updateRequest.fetch({
      data: {
        revisionId: params.revisionId,
        tableId: params.tableId,
        patches: params.patches,
      },
    })

    if (result.isRight) {
      return result.data.updateTable
    }

    return null
  }

  public async renameTable(params: RenameTableParams): Promise<RenameTableResult | null> {
    const result = await this.renameRequest.fetch({
      data: {
        revisionId: params.revisionId,
        tableId: params.tableId,
        nextTableId: params.nextTableId,
      },
    })

    if (result.isRight) {
      return result.data.renameTable
    }

    return null
  }

  public dispose(): void {
    this.createRequest.abort()
    this.updateRequest.abort()
    this.renameRequest.abort()
  }
}

container.register(TableMutationDataSource, () => new TableMutationDataSource(), { scope: 'request' })
