import { makeAutoObservable, runInAction } from 'mobx'
import { PatchRowOp } from 'src/__generated__/graphql-request'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext'
import { extractFileByPath, ExtractedFile, FileData } from 'src/pages/AssetsPage/lib/extractFilesFromData'
import { formatFileSize, isImageFile } from 'src/pages/AssetsPage/lib/fileFilters'
import { container } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService'
import { FileService } from 'src/shared/model/FileService'

export class AssetItemViewModel {
  private _file: FileData
  private _isUpdatingFileName = false
  private _isUploading = false

  constructor(
    private readonly extractedFile: ExtractedFile,
    private readonly context: ProjectContext,
    private readonly fileService: FileService,
  ) {
    this._file = { ...extractedFile.file }
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isUpdatingFileName(): boolean {
    return this._isUpdatingFileName
  }

  public get isUploadingFile(): boolean {
    return this._isUploading
  }

  public get file(): FileData {
    return this._file
  }

  public get fileId(): string {
    return this._file.fileId
  }

  public get fileName(): string {
    return this._file.fileName
  }

  public get mimeType(): string {
    return this._file.mimeType
  }

  public get size(): number {
    return this._file.size
  }

  public get formattedSize(): string {
    return formatFileSize(this._file.size)
  }

  public get status(): string {
    return this._file.status
  }

  public get isUploaded(): boolean {
    return this._file.status === 'uploaded'
  }

  public get url(): string {
    return this._file.url
  }

  public get width(): number {
    return this._file.width
  }

  public get height(): number {
    return this._file.height
  }

  public get dimensions(): string | null {
    if (this.width > 0 && this.height > 0) {
      return `${this.width} × ${this.height}`
    }
    return null
  }

  public get extension(): string {
    return this._file.extension
  }

  public get tableId(): string {
    return this.extractedFile.tableId
  }

  public get rowId(): string {
    return this.extractedFile.rowId
  }

  public get fieldPath(): string {
    return this.extractedFile.fieldPath
  }

  public get isImage(): boolean {
    return isImageFile(this._file.mimeType)
  }

  public get thumbnailUrl(): string | null {
    if (this.isImage && this.isUploaded && this.url) {
      return this.url
    }
    return null
  }

  public get uniqueKey(): string {
    return `${this.tableId}:${this.rowId}:${this.fieldPath}:${this.fileId}`
  }

  public get rowData(): unknown {
    return this.extractedFile.rowData
  }

  public updateFileData(fileData: FileData): void {
    this._file = { ...fileData }
  }

  public async updateFileName(newFileName: string): Promise<boolean> {
    if (newFileName === this.fileName) {
      return true
    }

    this._isUpdatingFileName = true
    const path = this.fieldPath ? `${this.fieldPath}.fileName` : 'fileName'

    try {
      const result = await client.PatchRowInline({
        data: {
          revisionId: this.context.revisionId,
          tableId: this.tableId,
          rowId: this.rowId,
          patches: [
            {
              op: PatchRowOp.Replace,
              path,
              value: newFileName,
            },
          ],
        },
      })

      if (result.patchRow?.row) {
        const fileData = extractFileByPath(result.patchRow.row.data, this.fieldPath)
        if (fileData) {
          runInAction(() => {
            this._file = { ...fileData }
          })
        }
        return true
      }
      return false
    } catch {
      return false
    } finally {
      runInAction(() => {
        this._isUpdatingFileName = false
      })
    }
  }

  public async uploadFile(file: File): Promise<boolean> {
    this._isUploading = true

    try {
      const result = await this.fileService.add({
        revisionId: this.context.revisionId,
        tableId: this.tableId,
        rowId: this.rowId,
        fileId: this.fileId,
        file,
      })

      if (result?.row) {
        const fileData = extractFileByPath(result.row.data, this.fieldPath)
        if (fileData) {
          runInAction(() => {
            this._file = { ...fileData }
          })
        }
        return true
      }
      return false
    } catch {
      return false
    } finally {
      runInAction(() => {
        this._isUploading = false
      })
    }
  }
}

export type AssetItemViewModelFactoryFn = (extractedFile: ExtractedFile) => AssetItemViewModel

export class AssetItemViewModelFactory {
  constructor(public readonly create: AssetItemViewModelFactoryFn) {}
}

container.register(
  AssetItemViewModelFactory,
  () => {
    return new AssetItemViewModelFactory((extractedFile) => {
      const context = container.get(ProjectContext)
      const fileService = container.get(FileService)
      return new AssetItemViewModel(extractedFile, context, fileService)
    })
  },
  { scope: 'request' },
)
