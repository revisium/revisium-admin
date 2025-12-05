import { makeAutoObservable } from 'mobx'
import { RowListItemFragment } from 'src/__generated__/graphql-request'
import { JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore'
import { traverseValue } from 'src/entities/Schema/lib/traverseValue'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'
import { createJsonValueStore } from 'src/entities/Schema/model/value/createJsonValueStore'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { JsonValue } from 'src/entities/Schema/types/json.types'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { getColumnBySchema } from 'src/widgets/RowList/lib/getColumnBySchema'
import { priorityColumnTraverseStore } from 'src/widgets/RowList/lib/priorityColumnTraverseStore'
import { RowItemViewModel } from './RowItemViewModel'
import { ColumnType } from './types'

export class ColumnsModel {
  private _columns: ColumnType[] = []
  private _schemaStore: ReturnType<typeof createJsonSchemaStore> | null = null
  private _columnNodeIds: Set<string> = new Set()

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get columns(): ColumnType[] {
    return this._columns
  }

  public get showHeader(): boolean {
    return this._columns.some((column) => column.title)
  }

  public init(schema: JsonSchema): void {
    this._schemaStore = createJsonSchemaStore(schema)
    const schemaList: JsonSchemaStore[] = []

    priorityColumnTraverseStore(this._schemaStore, (node) => {
      if (
        node.type === JsonSchemaTypeName.String ||
        node.type === JsonSchemaTypeName.Number ||
        node.type === JsonSchemaTypeName.Boolean
      ) {
        schemaList.push(node)
      } else if (node.type === JsonSchemaTypeName.Object) {
        if (node.$ref) {
          schemaList.push(node)
          return true
        }
      } else {
        return true
      }
    })

    this._columnNodeIds = new Set(schemaList.map((item) => item.nodeId))
    this._columns = schemaList.map((item) => ({
      id: item.nodeId,
      title: item.name,
      width: getColumnBySchema(item),
    }))
  }

  public createRowViewModels(
    rows: RowListItemFragment[],
    options: {
      isEdit: boolean
      permissionContext: PermissionContext
      onDelete: (rowId: string) => Promise<boolean>
    },
  ): RowItemViewModel[] {
    const schemaStore = this._schemaStore
    if (!schemaStore) return []

    return rows.map((row) => {
      const rootValue = createJsonValueStore(schemaStore, row.id, (row.data ?? {}) as JsonValue)
      const cells = this.collectCells(rootValue)

      return new RowItemViewModel({
        item: row,
        cells,
        isEdit: options.isEdit,
        permissionContext: options.permissionContext,
        onDelete: options.onDelete,
      })
    })
  }

  private collectCells(rootValue: JsonValueStore): JsonValueStore[] {
    const cells: JsonValueStore[] = []

    traverseValue(rootValue, (node) => {
      if (this._columnNodeIds.has(node.schema.nodeId)) {
        cells.push(node)
      }
    })

    return cells
  }
}
