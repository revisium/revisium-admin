import { makeAutoObservable, runInAction } from 'mobx'
import {
  AssetTableItemFragment,
  AssetsTablesDataQuery,
  QueryMode,
  SubSchemaItemFragment,
  SubSchemaItemsDataQuery,
  SubSchemaWhereInput,
} from 'src/__generated__/graphql-request'
import { JsonSchema } from 'src/entities/Schema'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore'
import { hasFileFields } from 'src/pages/AssetsPage/lib/extractFilesFromSchema'
import { ExtractedFile, FileData } from 'src/pages/AssetsPage/lib/extractFilesFromData'
import {
  AssetsFilter,
  FileSizeFilter,
  FileTypeFilter,
  getAllKnownMimePrefixes,
  MIME_TYPE_PREFIXES,
  SIZE_THRESHOLDS,
} from 'src/pages/AssetsPage/lib/fileFilters'
import { container, isAborted, ObservableRequest } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService'

const isValidJsonSchema = (value: unknown): value is JsonSchema => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const obj = value as Record<string, unknown>
  return typeof obj.type === 'string' || typeof obj.$ref === 'string'
}

const FILE_SCHEMA_ID = 'urn:jsonschema:io:revisium:file-schema:1.0.0'
const PAGINATION_PAGE_SIZE = 100

const buildFileTypeConditions = (filter: FileTypeFilter): SubSchemaWhereInput[] => {
  if (filter === 'all') {
    return []
  }

  if (filter === 'other') {
    const knownPrefixes = getAllKnownMimePrefixes()
    return knownPrefixes.map((prefix) => ({
      NOT: { data: { path: 'mimeType', string_starts_with: prefix } },
    }))
  }

  const prefixes = MIME_TYPE_PREFIXES[filter]
  if (prefixes.length === 1) {
    return [{ data: { path: 'mimeType', string_starts_with: prefixes[0] } }]
  }

  return [
    {
      OR: prefixes.map((prefix) => ({
        data: { path: 'mimeType', string_starts_with: prefix },
      })),
    },
  ]
}

const buildFileSizeConditions = (filter: FileSizeFilter): SubSchemaWhereInput[] => {
  switch (filter) {
    case 'all':
      return []
    case 'small':
      return [{ data: { path: 'size', lt: SIZE_THRESHOLDS.small } }]
    case 'medium':
      return [
        { data: { path: 'size', gte: SIZE_THRESHOLDS.small } },
        { data: { path: 'size', lt: SIZE_THRESHOLDS.medium } },
      ]
    case 'large':
      return [
        { data: { path: 'size', gte: SIZE_THRESHOLDS.medium } },
        { data: { path: 'size', lt: SIZE_THRESHOLDS.large } },
      ]
    case 'xlarge':
      return [{ data: { path: 'size', gte: SIZE_THRESHOLDS.large } }]
    default:
      return []
  }
}

const buildWhereInput = (filter: AssetsFilter): SubSchemaWhereInput | undefined => {
  const conditions: SubSchemaWhereInput[] = []

  if (filter.tableId) {
    conditions.push({ tableId: { equals: filter.tableId } })
  }

  if (filter.search.trim()) {
    conditions.push({
      data: { path: 'fileName', string_contains: filter.search.trim(), mode: QueryMode.Insensitive },
    })
  }

  if (filter.type !== 'all') {
    conditions.push(...buildFileTypeConditions(filter.type))
  }

  if (filter.status !== 'all') {
    conditions.push({ data: { path: 'status', equals: filter.status } })
  }

  if (filter.size !== 'all') {
    conditions.push(...buildFileSizeConditions(filter.size))
  }

  if (conditions.length === 0) {
    return undefined
  }

  if (conditions.length === 1) {
    return conditions[0]
  }

  return { AND: conditions }
}

export interface TableWithFiles {
  id: string
  versionId: string
  count: number
  fileCount: number
}

const mapSubSchemaItemToExtractedFile = (item: SubSchemaItemFragment): ExtractedFile | null => {
  const data = item.data as Record<string, unknown> | null
  if (!data || typeof data !== 'object') {
    return null
  }

  const fileData: FileData = {
    fileId: (data.fileId as string) ?? '',
    fileName: (data.fileName as string) ?? '',
    mimeType: (data.mimeType as string) ?? '',
    size: (data.size as number) ?? 0,
    status: (data.status as string) ?? '',
    url: (data.url as string) ?? '',
    width: (data.width as number) ?? 0,
    height: (data.height as number) ?? 0,
    extension: (data.extension as string) ?? '',
    hash: (data.hash as string) ?? '',
  }

  return {
    file: fileData,
    tableId: item.table.id,
    rowId: item.row.id,
    fieldPath: item.fieldPath,
  }
}

export class AssetsDataSource {
  private _tables: TableWithFiles[] = []
  private _files: ExtractedFile[] = []
  private _totalFilesCount: number | null = null
  private _isLoadingTables = false
  private _isLoadingFiles = false
  private _selectedTableId: string | null = null
  private _error: string | null = null

  private readonly tablesRequest = ObservableRequest.of(client.assetsTablesData, {
    skipResetting: true,
  })

  private readonly subSchemaRequest = ObservableRequest.of(client.subSchemaItemsData, {
    skipResetting: true,
  })

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get tables(): TableWithFiles[] {
    return this._tables
  }

  public get files(): ExtractedFile[] {
    return this._files
  }

  public get isLoadingTables(): boolean {
    return this._isLoadingTables
  }

  public get isLoadingFiles(): boolean {
    return this._isLoadingFiles
  }

  public get isLoading(): boolean {
    return this._isLoadingTables || this._isLoadingFiles
  }

  public get selectedTableId(): string | null {
    return this._selectedTableId
  }

  public get error(): string | null {
    return this._error
  }

  public get totalFilesCount(): number {
    return this._totalFilesCount ?? 0
  }

  public async loadTablesWithFiles(revisionId: string): Promise<boolean> {
    this._isLoadingTables = true
    this._error = null

    const allTables: AssetTableItemFragment[] = []
    let cursor: string | null = null
    let hasNextPage = true

    while (hasNextPage) {
      const result = await this.tablesRequest.fetch({
        data: {
          revisionId,
          first: PAGINATION_PAGE_SIZE,
          after: cursor,
        },
      })

      if (!result.isRight) {
        if (isAborted(result)) {
          return false
        }
        runInAction(() => {
          this._isLoadingTables = false
          this._error = 'Failed to load tables'
        })
        return false
      }

      const response: AssetsTablesDataQuery = result.data
      allTables.push(...response.tables.edges.map((edge) => edge.node))
      hasNextPage = response.tables.pageInfo.hasNextPage
      cursor = response.tables.pageInfo.endCursor ?? null
    }

    const tablesWithFiles = this.filterTablesWithFileFields(allTables)

    runInAction(() => {
      this._tables = tablesWithFiles
      this._isLoadingTables = false
    })

    return true
  }

  public async loadFiles(revisionId: string, filter: AssetsFilter): Promise<boolean> {
    this._isLoadingFiles = true
    this._selectedTableId = filter.tableId
    this._error = null

    const allFiles = await this.loadSubSchemaItems(revisionId, filter)

    if (allFiles === null) {
      return false
    }

    runInAction(() => {
      this._files = allFiles
      if (this._totalFilesCount === null) {
        this._totalFilesCount = allFiles.length
      }
      this._isLoadingFiles = false
    })

    return true
  }

  private async loadSubSchemaItems(revisionId: string, filter: AssetsFilter): Promise<ExtractedFile[] | null> {
    const allFiles: ExtractedFile[] = []
    let cursor: string | null = null
    let hasNextPage = true
    const where = buildWhereInput(filter)

    while (hasNextPage) {
      const result = await this.subSchemaRequest.fetch({
        data: {
          revisionId,
          schemaId: FILE_SCHEMA_ID,
          first: PAGINATION_PAGE_SIZE,
          after: cursor,
          where,
        },
      })

      if (!result.isRight) {
        if (isAborted(result)) {
          return null
        }
        runInAction(() => {
          this._isLoadingFiles = false
          this._error = 'Failed to load files'
        })
        return null
      }

      const response: SubSchemaItemsDataQuery = result.data
      const items = response.subSchemaItems.edges.map((edge) => edge.node)

      items.forEach((item) => {
        const file = mapSubSchemaItemToExtractedFile(item)
        if (file) {
          allFiles.push(file)
        }
      })

      hasNextPage = response.subSchemaItems.pageInfo.hasNextPage
      cursor = response.subSchemaItems.pageInfo.endCursor ?? null
    }

    return allFiles
  }

  public reset(): void {
    this._tables = []
    this._files = []
    this._totalFilesCount = null
    this._selectedTableId = null
    this._error = null
  }

  public dispose(): void {
    this.tablesRequest.abort()
    this.subSchemaRequest.abort()
  }

  private filterTablesWithFileFields(tables: AssetTableItemFragment[]): TableWithFiles[] {
    const result: TableWithFiles[] = []

    for (const table of tables) {
      try {
        if (!isValidJsonSchema(table.schema)) {
          continue
        }
        const schemaStore = createJsonSchemaStore(table.schema)
        if (hasFileFields(schemaStore)) {
          result.push({
            id: table.id,
            versionId: table.versionId,
            count: table.count,
            fileCount: 0,
          })
        }
      } catch {
        continue
      }
    }

    return result
  }
}

container.register(AssetsDataSource, () => new AssetsDataSource(), { scope: 'request' })
