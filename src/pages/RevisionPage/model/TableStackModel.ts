import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { JsonSchema } from 'src/entities/Schema'
import { JsonPatch } from 'src/entities/Schema/types/json-patch.types.ts'
import { createSchemaNode } from 'src/features/SchemaEditor/lib/createSchemaNode.ts'
import { getJsonDraftPathByNode } from 'src/features/SchemaEditor/lib/getJsonDraftPathByNode.ts'
import { RootNodeStore } from 'src/features/SchemaEditor/model/RootNodeStore.ts'
import { StringReferenceNodeStore } from 'src/features/SchemaEditor/model/StringReferenceNodeStore.ts'
import { CreateTableCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateTableCommand.ts'
import { UpdateTableCommand } from 'src/shared/model/BackendStore/handlers/mutations/UpdateTableCommand.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export enum TableStackModelStateType {
  List = 'List',
  CreatingTable = 'CreatingTable',
  ConnectingReferenceTable = 'ConnectingReferenceTable',
  UpdatingTable = 'UpdatingTable',
}

export type TableStackModelStateList = { type: TableStackModelStateType.List; isSelectingReference: boolean }

export type TableStackModelStateCreatingTable = {
  type: TableStackModelStateType.CreatingTable
  store: RootNodeStore
  isSelectingReference: boolean
}

export type TableStackModelStateConnectingReferenceTable = {
  type: TableStackModelStateType.ConnectingReferenceTable
  previousType: TableStackModelStateType.CreatingTable | TableStackModelStateType.UpdatingTable
  store: RootNodeStore
  referenceNode: StringReferenceNodeStore
  isSelectingReference: boolean
}

export type TableStackModelStateUpdatingTable = {
  type: TableStackModelStateType.UpdatingTable
  store: RootNodeStore
  isSelectingReference: boolean
}

export type TableStackModelState =
  | TableStackModelStateList
  | TableStackModelStateCreatingTable
  | TableStackModelStateConnectingReferenceTable
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

  public get currentReferencePath() {
    if (this.state.type === TableStackModelStateType.ConnectingReferenceTable && this.state.referenceNode.draftParent) {
      return getJsonDraftPathByNode(this.state.referenceNode.draftParent)
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
      isSelectingReference: this.state.isSelectingReference,
    }
  }

  public toConnectingReferenceTable(referenceNode: StringReferenceNodeStore) {
    if (
      this.state.type === TableStackModelStateType.CreatingTable ||
      this.state.type === TableStackModelStateType.UpdatingTable
    ) {
      this.state = {
        type: TableStackModelStateType.ConnectingReferenceTable,
        previousType: this.state.type,
        store: this.state.store,
        isSelectingReference: this.state.isSelectingReference,
        referenceNode,
      }
    } else {
      throw new Error('Invalid state')
    }
  }

  public toCreatingTable() {
    const store =
      this.state.type === TableStackModelStateType.ConnectingReferenceTable ? this.state.store : new RootNodeStore()

    this.state = {
      type: TableStackModelStateType.CreatingTable,
      store,
      isSelectingReference: this.state.isSelectingReference,
    }
  }

  public toUpdatingTableFromConnectingReferenceTable() {
    if (this.state.type !== TableStackModelStateType.ConnectingReferenceTable) {
      throw new Error('Invalid state')
    }

    const store = this.state.store

    this.state = {
      type: TableStackModelStateType.UpdatingTable,
      store,
      isSelectingReference: this.state.isSelectingReference,
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
      isSelectingReference: false,
    }
  }

  public toUpdatingTable(tableVersionId: string) {
    const table = this.rootStore.cache.getTable(tableVersionId)

    if (!table) {
      throw new Error(`Not found table.versionId ${tableVersionId}`)
    }

    const root = createSchemaNode(table.schema as JsonSchema)
    root.setId(table.id)
    root.submitChanges()

    const store = new RootNodeStore(root)

    this.state = {
      type: TableStackModelStateType.UpdatingTable,
      store,
      isSelectingReference: this.state.isSelectingReference,
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

  public async updateTable(tableId: string, patches: JsonPatch[]) {
    try {
      const command = new UpdateTableCommand(this.rootStore, this.branch, tableId, patches)
      await command.execute()

      return true
    } catch (e) {
      console.error(e)

      return false
    }
  }
}
