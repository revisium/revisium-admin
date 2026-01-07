import { nanoid } from 'nanoid'
import { JsonObjectSchema, schemaRefsMapper } from 'src/entities/Schema'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore.ts'
import { createEmptyJsonValueStore } from 'src/entities/Schema/model/value/createEmptyJsonValueStore.ts'
import { traverseValue } from 'src/entities/Schema/lib/traverseValue.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { container } from 'src/shared/lib'

export class RowDataCardStoreFactory {
  public createEmpty(schema: JsonObjectSchema, tableId: string): RowDataCardStore {
    const rowId = this.generateRowId(tableId)
    const schemaStore = createJsonSchemaStore(schema)
    return new RowDataCardStore(schemaStore, createEmptyJsonValueStore(schemaStore), rowId)
  }

  public createFromClone(schema: JsonObjectSchema, tableId: string, data: JsonValue): RowDataCardStore {
    const rowId = this.generateRowId(tableId)
    const schemaStore = createJsonSchemaStore(schema)
    const store = new RowDataCardStore(schemaStore, createEmptyJsonValueStore(schemaStore), rowId, null, 0)
    store.root.updateBaseValue(data)
    this.clearFileRefs(store)
    return store
  }

  public createForUpdating(
    schema: JsonObjectSchema,
    rowId: string,
    data: JsonValue,
    foreignKeysCount: number,
  ): RowDataCardStore {
    const schemaStore = createJsonSchemaStore(schema)
    return new RowDataCardStore(schemaStore, createEmptyJsonValueStore(schemaStore), rowId, { data }, foreignKeysCount)
  }

  private generateRowId(tableId: string): string {
    return `${tableId.toLowerCase()}-${nanoid(9).toLowerCase()}`
  }

  private clearFileRefs(store: RowDataCardStore): void {
    traverseValue(store.root, (item) => {
      if (item.$ref) {
        const refSchema = schemaRefsMapper[item.$ref]
        if (refSchema) {
          const valueStore = createEmptyJsonValueStore(createJsonSchemaStore(refSchema))
          item.updateBaseValue(valueStore.getPlainValue())
        }
      }
    })
  }
}

container.register(RowDataCardStoreFactory, () => new RowDataCardStoreFactory(), { scope: 'singleton' })
