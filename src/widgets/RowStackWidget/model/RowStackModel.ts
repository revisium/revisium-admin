import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonObjectSchema } from 'src/entities/Schema'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore.ts'
import { createJsonValuePathByStore } from 'src/entities/Schema/lib/createJsonValuePathByStore.ts'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { createJsonValueStore } from 'src/entities/Schema/model/value/createJsonValueStore.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { IRowModel, ITableModel } from 'src/shared/model/BackendStore'
import { CreateRowCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateRowCommand.ts'
import { UpdateRowCommand } from 'src/shared/model/BackendStore/handlers/mutations/UpdateRowCommand.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export enum RowStackModelStateType {
  List = 'List',
  CreatingRow = 'CreatingRow',
  ConnectingForeignKeyRow = 'ConnectingForeignKeyRow',
  UpdatingRow = 'UpdatingRow',
}

export type RowStackModelStateList = { type: RowStackModelStateType.List; isSelectingForeignKey: boolean }

export type RowStackModelStateCreatingTable = {
  type: RowStackModelStateType.CreatingRow
  isSelectingForeignKey: boolean
  store: RowDataCardStore
}

export type RowStackModelStateConnectingForeignKeyTable = {
  type: RowStackModelStateType.ConnectingForeignKeyRow
  previousType: RowStackModelStateType.CreatingRow | RowStackModelStateType.UpdatingRow
  isSelectingForeignKey: boolean
  store: RowDataCardStore
  foreignKeyNode: JsonStringValueStore
}

export type RowStackModelStateUpdatingTable = {
  type: RowStackModelStateType.UpdatingRow
  isSelectingForeignKey: boolean
  store: RowDataCardStore
}

export type RowStackModelState =
  | RowStackModelStateList
  | RowStackModelStateCreatingTable
  | RowStackModelStateConnectingForeignKeyTable
  | RowStackModelStateUpdatingTable

export class RowStackModel {
  public readonly id = nanoid()

  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
    private readonly customTable: ITableModel | null,
    public state: RowStackModelState,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get table(): ITableModel {
    return this.customTable || this.projectPageModel.tableOrThrow
  }

  public get schema(): JsonObjectSchema {
    return this.table.schema as JsonObjectSchema
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  public get isEditableRevision() {
    return this.projectPageModel.isEditableRevision
  }

  public get currentForeignKeyPath() {
    if (this.state.type === RowStackModelStateType.ConnectingForeignKeyRow) {
      return createJsonValuePathByStore(this.state.foreignKeyNode)
    }
    return ''
  }

  public async createRow(rowId: string, data: JsonValue): Promise<IRowModel | null> {
    try {
      const command = new CreateRowCommand(this.rootStore, this.projectPageModel, this.branch, this.table)
      return await command.execute(rowId, data)
    } catch (e) {
      console.error(e)

      return null
    }
  }

  public async updateRow(store: RowDataCardStore): Promise<boolean> {
    try {
      const command = new UpdateRowCommand(this.rootStore, this.projectPageModel, store)
      return await command.execute()
    } catch (e) {
      console.error(e)

      return false
    }
  }

  public toList() {
    this.state = {
      type: RowStackModelStateType.List,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
    }
  }

  public toConnectingForeignKeyRow(foreignKeyNode: JsonStringValueStore) {
    if (
      this.state.type === RowStackModelStateType.CreatingRow ||
      this.state.type === RowStackModelStateType.UpdatingRow
    ) {
      this.state = {
        type: RowStackModelStateType.ConnectingForeignKeyRow,
        previousType: this.state.type,
        isSelectingForeignKey: this.state.isSelectingForeignKey,
        store: this.state.store,
        foreignKeyNode,
      }
    } else {
      throw new Error('Invalid state')
    }
  }

  public toCreatingRow() {
    const rowId = `${this.table.id.toLowerCase()}-${nanoid(9).toLowerCase()}`
    const store =
      this.state.type === RowStackModelStateType.ConnectingForeignKeyRow
        ? this.state.store
        : new RowDataCardStore(createJsonValueStore(createJsonSchemaStore(this.schema)), rowId)

    this.state = {
      type: RowStackModelStateType.CreatingRow,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
      store,
    }
  }

  public toUpdatingTableFromConnectingForeignKeyRow() {
    if (this.state.type !== RowStackModelStateType.ConnectingForeignKeyRow) {
      throw new Error('Invalid state')
    }

    const store = this.state.store

    this.state = {
      type: RowStackModelStateType.UpdatingRow,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
      store,
    }
  }

  public init() {}

  public dispose() {}

  public updateStore(store: RowDataCardStore) {
    if (this.state.type === RowStackModelStateType.UpdatingRow) {
      this.state.store = store
    }
  }
}
