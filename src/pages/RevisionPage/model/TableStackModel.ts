import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchema } from 'src/entities/Schema'
import {
  RootNodeStore,
  StringForeignKeyNodeStore,
  createSchemaNode,
  getJsonDraftPathByNode,
} from 'src/widgets/SchemaEditor'
import { CreateTableCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateTableCommand.ts'
import { UpdateTableCommand } from 'src/shared/model/BackendStore/handlers/mutations/UpdateTableCommand.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export enum TableStackModelStateType {
  List = 'List',
  CreatingTable = 'CreatingTable',
  ConnectingForeignKeyTable = 'ConnectingForeignKeyTable',
  UpdatingTable = 'UpdatingTable',
}

export type TableStackModelStateList = { type: TableStackModelStateType.List; isSelectingForeignKey: boolean }

export type TableStackModelStateCreatingTable = {
  type: TableStackModelStateType.CreatingTable
  store: RootNodeStore
  isSelectingForeignKey: boolean
}

export type TableStackModelStateConnectingForeignKeyTable = {
  type: TableStackModelStateType.ConnectingForeignKeyTable
  previousType: TableStackModelStateType.CreatingTable | TableStackModelStateType.UpdatingTable
  store: RootNodeStore
  foreignKeyNode: StringForeignKeyNodeStore
  isSelectingForeignKey: boolean
}

export type TableStackModelStateUpdatingTable = {
  type: TableStackModelStateType.UpdatingTable
  store: RootNodeStore
  isSelectingForeignKey: boolean
}

export type TableStackModelState =
  | TableStackModelStateList
  | TableStackModelStateCreatingTable
  | TableStackModelStateConnectingForeignKeyTable
  | TableStackModelStateUpdatingTable

export class TableStackModel {
  public readonly id = nanoid()

  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
    public state: TableStackModelState,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get currentForeignKeyPath() {
    if (
      this.state.type === TableStackModelStateType.ConnectingForeignKeyTable &&
      this.state.foreignKeyNode.draftParent
    ) {
      return getJsonDraftPathByNode(this.state.foreignKeyNode.draftParent)
    }
    return ''
  }

  public get title() {
    if (this.revision.id === this.branch.draft.id) {
      return `Branch - ${this.branch.name}[draft]`
    } else if (this.revision.id === this.branch.head.id) {
      return `Branch - ${this.branch.name}`
    }

    return `Branch - ${this.branch.name}[rev:${this.revision.id.slice(0, 6)}]`
  }

  public toList() {
    this.state = {
      type: TableStackModelStateType.List,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
    }
  }

  public toConnectingForeignKeyTable(foreignKeyNode: StringForeignKeyNodeStore) {
    if (
      this.state.type === TableStackModelStateType.CreatingTable ||
      this.state.type === TableStackModelStateType.UpdatingTable
    ) {
      this.state = {
        type: TableStackModelStateType.ConnectingForeignKeyTable,
        previousType: this.state.type,
        store: this.state.store,
        isSelectingForeignKey: this.state.isSelectingForeignKey,
        foreignKeyNode,
      }
    } else {
      throw new Error('Invalid state')
    }
  }

  public toCreatingTable() {
    const store =
      this.state.type === TableStackModelStateType.ConnectingForeignKeyTable ? this.state.store : new RootNodeStore()

    this.state = {
      type: TableStackModelStateType.CreatingTable,
      store,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
    }
  }

  public toCloningTable(copyTableVersionId: string) {
    const table = this.rootStore.cache.getTable(copyTableVersionId)

    if (!table) {
      throw new Error(`Not found table.versionId ${copyTableVersionId}`)
    }

    const root = createSchemaNode(table.schema as JsonSchema, { collapse: true })
    const store = new RootNodeStore(root, table.id)

    this.state = {
      type: TableStackModelStateType.CreatingTable,
      store,
      isSelectingForeignKey: false,
    }
  }

  public toUpdatingTableFromConnectingForeignKeyTable() {
    if (this.state.type !== TableStackModelStateType.ConnectingForeignKeyTable) {
      throw new Error('Invalid state')
    }

    const store = this.state.store

    this.state = {
      type: TableStackModelStateType.UpdatingTable,
      store,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
    }
  }

  public toUpdatingTableFromCreatingTable() {
    if (this.state.type !== TableStackModelStateType.CreatingTable) {
      throw new Error('Invalid state')
    }

    const store = this.state.store

    this.state = {
      type: TableStackModelStateType.UpdatingTable,
      store,
      isSelectingForeignKey: false,
    }
  }

  public toUpdatingTable(tableVersionId: string) {
    const table = this.rootStore.cache.getTable(tableVersionId)

    if (!table) {
      throw new Error(`Not found table.versionId ${tableVersionId}`)
    }

    const root = createSchemaNode(table.schema as JsonSchema, { collapse: true })
    root.setId(table.id)
    root.submitChanges()

    const store = new RootNodeStore(root, table.id)

    this.state = {
      type: TableStackModelStateType.UpdatingTable,
      store,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
    }
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }

  public init() {}

  public dispose() {}

  public async createTable(tableId: string, schema: JsonSchema) {
    try {
      const command = new CreateTableCommand(this.rootStore, this.branch, tableId, schema)
      await command.execute()

      return true
    } catch (e) {
      console.log(e)

      return false
    }
  }

  public async updateTable(store: RootNodeStore) {
    try {
      const command = new UpdateTableCommand(this.rootStore, this.branch, store)
      await command.execute()

      return true
    } catch (e) {
      console.error(e)

      return false
    }
  }
}
