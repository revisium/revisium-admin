import { makeAutoObservable } from 'mobx'
import { ExtractedFile, FileData } from 'src/pages/AssetsPage/lib/extractFilesFromData'
import { formatFileSize, isImageFile } from 'src/pages/AssetsPage/lib/fileFilters'
import { container } from 'src/shared/lib'

export class AssetItemViewModel {
  private _file: FileData

  constructor(private readonly extractedFile: ExtractedFile) {
    this._file = { ...extractedFile.file }
    makeAutoObservable(this, {}, { autoBind: true })
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

  public updateFileData(fileData: FileData): void {
    this._file = { ...fileData }
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
      return new AssetItemViewModel(extractedFile)
    })
  },
  { scope: 'request' },
)
