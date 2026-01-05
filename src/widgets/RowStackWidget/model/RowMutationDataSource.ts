import { makeAutoObservable } from 'mobx'
import {
  CreateRowForStackMutation,
  RenameRowForStackMutation,
  UpdateRowForStackMutation,
} from 'src/__generated__/graphql-request.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { FileService } from 'src/shared/model/FileService.ts'

export interface CreateRowParams {
  revisionId: string
  tableId: string
  rowId: string
  data: JsonValue
}

export interface UpdateRowParams {
  revisionId: string
  tableId: string
  rowId: string
  data: JsonValue
}

export interface RenameRowParams {
  revisionId: string
  tableId: string
  rowId: string
  nextRowId: string
}

export interface UploadFileParams {
  revisionId: string
  tableId: string
  rowId: string
  fileId: string
  file: File
}

export type CreateRowResult = CreateRowForStackMutation['createRow']
export type UpdateRowResult = UpdateRowForStackMutation['updateRow']
export type RenameRowResult = RenameRowForStackMutation['renameRow']

export class RowMutationDataSource {
  private readonly createRequest = ObservableRequest.of(client.createRowForStack)
  private readonly updateRequest = ObservableRequest.of(client.updateRowForStack)
  private readonly renameRequest = ObservableRequest.of(client.renameRowForStack)

  constructor(private readonly fileService: FileService) {
    makeAutoObservable(this)
  }

  public get isLoading(): boolean {
    return this.createRequest.isLoading || this.updateRequest.isLoading || this.renameRequest.isLoading
  }

  public get error(): string | null {
    return this.createRequest.errorMessage ?? this.updateRequest.errorMessage ?? this.renameRequest.errorMessage ?? null
  }

  public async createRow(params: CreateRowParams): Promise<CreateRowResult | null> {
    const result = await this.createRequest.fetch({
      data: {
        revisionId: params.revisionId,
        tableId: params.tableId,
        rowId: params.rowId,
        data: params.data,
      },
    })

    if (result.isRight) {
      return result.data.createRow
    }

    return null
  }

  public async updateRow(params: UpdateRowParams): Promise<UpdateRowResult | null> {
    const result = await this.updateRequest.fetch({
      data: {
        revisionId: params.revisionId,
        tableId: params.tableId,
        rowId: params.rowId,
        data: params.data,
      },
    })

    if (result.isRight) {
      return result.data.updateRow
    }

    return null
  }

  public async renameRow(params: RenameRowParams): Promise<RenameRowResult | null> {
    const result = await this.renameRequest.fetch({
      data: {
        revisionId: params.revisionId,
        tableId: params.tableId,
        rowId: params.rowId,
        nextRowId: params.nextRowId,
      },
    })

    if (result.isRight) {
      return result.data.renameRow
    }

    return null
  }

  public async uploadFile(params: UploadFileParams): Promise<UpdateRowResult | null> {
    const response = await this.fileService.add({
      revisionId: params.revisionId,
      tableId: params.tableId,
      rowId: params.rowId,
      fileId: params.fileId,
      file: params.file,
    })

    return response
  }

  public dispose(): void {
    this.createRequest.abort()
    this.updateRequest.abort()
    this.renameRequest.abort()
  }
}

container.register(
  RowMutationDataSource,
  () => {
    const fileService = container.get(FileService)
    return new RowMutationDataSource(fileService)
  },
  { scope: 'request' },
)
