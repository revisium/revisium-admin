import { JsonObjectSchema } from 'src/entities/Schema'
import { ForeignKeyTableWithRows } from 'src/widgets/RowStackWidget/model/ForeignKeyTableDataSource.ts'

export interface ForeignSchemaCacheDataSource {
  loadTableWithRows(revisionId: string, tableId: string, first?: number): Promise<ForeignKeyTableWithRows | null>
  dispose(): void
}

export class ForeignSchemaCache {
  private readonly cache = new Map<string, JsonObjectSchema>()

  constructor(
    private readonly mainTableId: string,
    private readonly mainSchema: JsonObjectSchema,
    private readonly dataSourceFactory: () => ForeignSchemaCacheDataSource,
  ) {}

  public get(tableId: string): JsonObjectSchema | undefined {
    if (tableId === this.mainTableId) {
      return this.mainSchema
    }
    return this.cache.get(tableId)
  }

  public getOrThrow(tableId: string): JsonObjectSchema {
    const schema = this.get(tableId)
    if (!schema) {
      throw new Error(`Schema for table ${tableId} not available`)
    }
    return schema
  }

  public has(tableId: string): boolean {
    return tableId === this.mainTableId || this.cache.has(tableId)
  }

  public async load(revisionId: string, tableId: string): Promise<JsonObjectSchema> {
    if (tableId === this.mainTableId) {
      return this.mainSchema
    }

    const cached = this.cache.get(tableId)
    if (cached) {
      return cached
    }

    const dataSource = this.dataSourceFactory()
    try {
      const result = await dataSource.loadTableWithRows(revisionId, tableId, 0)
      if (!result) {
        throw new Error(`Failed to load schema for table ${tableId}`)
      }
      const schema = result.table.schema as JsonObjectSchema
      this.cache.set(tableId, schema)
      return schema
    } finally {
      dataSource.dispose()
    }
  }
}
