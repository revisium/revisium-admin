import { makeAutoObservable, runInAction } from 'mobx'
import { RowPageDataQuery } from 'src/__generated__/graphql-request.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonObjectSchema } from 'src/entities/Schema'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore.ts'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store.ts'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { createEmptyJsonValueStore } from 'src/entities/Schema/model/value/createEmptyJsonValueStore.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { container } from 'src/shared/lib'
import { isValidSchema } from 'src/shared/schema/isValidSchema.ts'
import { ForeignKeyTableDataSource } from 'src/widgets/RowStackWidget/model/ForeignKeyTableDataSource.ts'
import { RowStackModel, RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'
import { createTableAdapter } from 'src/widgets/RowStackWidget/model/tableAdapter.ts'
import { MinimalTableData } from 'src/widgets/RowStackWidget/model/types.ts'

export interface RowStackWidgetRowData {
  row: NonNullable<RowPageDataQuery['row']>
  table: NonNullable<RowPageDataQuery['table']>
  foreignKeysCount: number
}

export class RowStackWidgetModel {
  public stack: [RowStackModel] & RowStackModel[]

  constructor(
    private readonly projectContext: ProjectContext,
    private readonly rowData: RowStackWidgetRowData | null,
    startWithUpdating?: boolean,
  ) {
    const table = this.getTable()

    this.stack = [
      new RowStackModel(this.projectContext, table, {
        type: RowStackModelStateType.List,
        isSelectingForeignKey: false,
      }),
    ]

    if (startWithUpdating && this.rowData) {
      this.stack = [
        new RowStackModel(this.projectContext, table, {
          type: RowStackModelStateType.UpdatingRow,
          isSelectingForeignKey: false,
          store: this.createStore(),
        }),
      ]
    }

    makeAutoObservable(this, {}, { autoBind: true })
  }

  private getTable(): MinimalTableData {
    if (this.rowData) {
      return createTableAdapter(this.rowData.table)
    }

    const contextTable = this.projectContext.table
    if (!contextTable) {
      throw new Error('RowStackWidgetModel: table is not provided')
    }

    return {
      id: contextTable.id,
      schema: contextTable.schema,
      readonly: contextTable.readonly,
    }
  }

  public async selectForeignKey(item: RowStackModel, node: JsonStringValueStore, isCreating?: boolean): Promise<void> {
    if (!node.foreignKey) {
      throw new Error('Invalid foreign key')
    }

    const customTable = await this.getFetchedTableWithRows(node.foreignKey)

    item.toConnectingForeignKeyRow(node, isCreating)

    runInAction(() => {
      const selectingForeignKey = new RowStackModel(this.projectContext, customTable, {
        type: RowStackModelStateType.List,
        isSelectingForeignKey: true,
      })
      this.stack.push(selectingForeignKey)

      if (isCreating) {
        selectingForeignKey.toCreatingRow()
      }
    })
  }

  public cancelSelectingForeignKey(item: RowStackModel) {
    const foundIndex = this.stack.findIndex((iterItem) => iterItem === item)

    if (foundIndex !== -1) {
      this.stack.splice(foundIndex + 1)
    }

    if (item.state.type === RowStackModelStateType.ConnectingForeignKeyRow) {
      if (item.state.previousType === RowStackModelStateType.CreatingRow) {
        item.toCreatingRow()
      } else if (item.state.previousType === RowStackModelStateType.UpdatingRow) {
        item.toUpdatingTableFromConnectingForeignKeyRow()
      }
    }
  }

  public onSelectedForeignKey(item: RowStackModel, rowId: string) {
    const foundIndex = this.stack.findIndex((iterItem) => iterItem === item)

    const parentItem = this.stack[foundIndex - 1]

    if (parentItem.state.type === RowStackModelStateType.ConnectingForeignKeyRow) {
      parentItem.state.foreignKeyNode.setValue(rowId)

      if (parentItem.state.previousType === RowStackModelStateType.CreatingRow) {
        parentItem.toCreatingRow()
      } else if (parentItem.state.previousType === RowStackModelStateType.UpdatingRow) {
        parentItem.toUpdatingTableFromConnectingForeignKeyRow()
      }
    }

    this.stack.splice(foundIndex)
  }

  public updateStore() {
    this.stack[0].updateStore(this.createStore())
  }

  public init() {
    // No reaction needed - data comes from props
  }

  public dispose() {
    this.stack.forEach((item) => item.dispose())
  }

  private async getFetchedTableWithRows(tableId: string): Promise<MinimalTableData> {
    const foreignKeyDataSource = container.get(ForeignKeyTableDataSource)

    try {
      const result = await foreignKeyDataSource.loadTableWithRows(this.projectContext.revision.id, tableId)

      if (!result) {
        throw new Error(`Not found table ${tableId}`)
      }

      return createTableAdapter(result.table)
    } finally {
      foreignKeyDataSource.dispose()
    }
  }

  private createStore(): RowDataCardStore {
    if (!this.rowData) {
      throw new Error('Cannot create store without rowData')
    }

    const schema = this.rowData.table.schema as JsonObjectSchema

    const schemaStore = isValidSchema(schema) ? createJsonSchemaStore(schema) : new JsonObjectStore()
    return new RowDataCardStore(
      schemaStore,
      createEmptyJsonValueStore(schemaStore),
      this.rowData.row.id,
      { data: this.rowData.row.data as JsonValue },
      this.rowData.foreignKeysCount,
    )
  }
}
