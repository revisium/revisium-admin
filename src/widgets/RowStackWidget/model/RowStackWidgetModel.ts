import { IReactionDisposer, makeAutoObservable, reaction, runInAction } from 'mobx'
import { JsonObjectSchema } from 'src/entities/Schema'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore.ts'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store.ts'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { createJsonValueStore } from 'src/entities/Schema/model/value/createJsonValueStore.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { ITableModel } from 'src/shared/model/BackendStore'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'
import { isValidSchema } from 'src/shared/schema/isValidSchema.ts'
import { RowStackModel, RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'

export class RowStackWidgetModel {
  public stack: [RowStackModel] & RowStackModel[]

  private disposers: IReactionDisposer[] = []

  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
    startWithUpdating?: boolean,
  ) {
    this.stack = [
      new RowStackModel(this.rootStore, this.projectPageModel, null, {
        type: RowStackModelStateType.List,
        isSelectingForeignKey: false,
      }),
    ]

    if (startWithUpdating) {
      this.stack = [
        new RowStackModel(this.rootStore, this.projectPageModel, null, {
          type: RowStackModelStateType.UpdatingRow,
          isSelectingForeignKey: false,
          store: this.createStore(),
        }),
      ]
    }

    makeAutoObservable(this, {}, { autoBind: true })
  }

  public async selectForeignKey(item: RowStackModel, node: JsonStringValueStore): Promise<void> {
    if (!node.foreignKey) {
      throw new Error('Invalid foreign key')
    }

    const customTable = await this.getFetchedTableWithRows(node.foreignKey)

    item.toConnectingForeignKeyRow(node)

    runInAction(() => {
      this.stack.push(
        new RowStackModel(this.rootStore, this.projectPageModel, customTable, {
          type: RowStackModelStateType.List,
          isSelectingForeignKey: true,
        }),
      )
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
    this.disposers.push(
      reaction(
        () => this.projectPageModel.row,
        () => {
          this.updateStore()
        },
      ),
    )
  }

  public dispose() {
    this.disposers.length = 0
  }

  private async getFetchedTableWithRows(tableId: string): Promise<ITableModel> {
    const tableVariables = {
      revisionId: this.projectPageModel.revisionOrThrow.id,
      tableId: tableId,
    }

    const table =
      this.rootStore.cache.getTableByVariables(tableVariables) ||
      (await rootStore.queryTable({
        data: tableVariables,
      }))

    if (!table) {
      throw new Error(`Not found table ${tableId}`)
    }

    if (!table.rowsConnection.countLoaded) {
      await rootStore.queryRows({ revisionId: this.projectPageModel.revisionOrThrow.id, tableId: table.id, first: 50 })
    }

    return table
  }

  private createStore() {
    const schema = this.projectPageModel.tableOrThrow.schema as JsonObjectSchema

    return new RowDataCardStore(
      createJsonValueStore(isValidSchema(schema) ? createJsonSchemaStore(schema) : new JsonObjectStore()),
      this.projectPageModel.rowOrThrow.id,
      this.projectPageModel.rowOrThrow,
      this.projectPageModel,
    )
  }
}
