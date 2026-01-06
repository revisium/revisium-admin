import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonSchema } from 'src/entities/Schema'
import { container } from 'src/shared/lib'
import {
  RootNodeStore,
  StringForeignKeyNodeStore,
  createSchemaNode,
  getJsonDraftPathByNode,
} from 'src/widgets/SchemaEditor'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { TableFetchDataSource, TableFetchResult } from 'src/pages/RevisionPage/model/TableFetchDataSource.ts'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'

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

  private readonly mutationDataSource: TableMutationDataSource
  private readonly tableListRefreshService: TableListRefreshService
  private readonly permissionContext: PermissionContext

  constructor(
    private readonly projectContext: ProjectContext,
    public state: TableStackModelState,
  ) {
    this.mutationDataSource = container.get(TableMutationDataSource)
    this.tableListRefreshService = container.get(TableListRefreshService)
    this.permissionContext = container.get(PermissionContext)
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

  public get isEditableRevision() {
    return this.projectContext.isDraftRevision
  }

  public get canCreateTable(): boolean {
    return this.isEditableRevision && this.permissionContext.canCreateTable
  }

  public get revisionId(): string {
    return this.projectContext.revision.id
  }

  private get branch() {
    return this.projectContext.branch
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

  public async toCloningTable(tableId: string): Promise<void> {
    const table = await this.fetchTable(tableId)

    if (!table) {
      throw new Error(`Not found table ${tableId}`)
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

  public async toUpdatingTable(tableId: string): Promise<void> {
    const table = await this.fetchTable(tableId)

    if (!table) {
      throw new Error(`Not found table ${tableId}`)
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

  public async createTable(tableId: string, schema: JsonSchema): Promise<boolean> {
    try {
      const result = await this.mutationDataSource.createTable({
        revisionId: this.branch.draft.id,
        tableId,
        schema,
      })

      if (result) {
        if (!this.branch.touched) {
          this.projectContext.updateTouched(true)
        }
        this.refreshTableList()
        return true
      }

      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  public async updateTable(store: RootNodeStore): Promise<boolean> {
    try {
      const needRename = store.tableId !== store.draftTableId
      let wasCreatedNewVersionTable = false

      if (needRename) {
        const renameResult = await this.mutationDataSource.renameTable({
          revisionId: this.branch.draft.id,
          tableId: store.tableId,
          nextTableId: store.draftTableId,
        })

        if (!renameResult) {
          return false
        }

        wasCreatedNewVersionTable = true
      }

      const patches = store.getPatches()

      if (patches.length) {
        const updateResult = await this.mutationDataSource.updateTable({
          revisionId: this.branch.draft.id,
          tableId: store.draftTableId,
          patches,
        })

        if (!updateResult) {
          return false
        }

        wasCreatedNewVersionTable = true
      }

      if (!this.branch.touched) {
        this.projectContext.updateTouched(true)
      }

      if (wasCreatedNewVersionTable) {
        this.refreshTableList()
      }

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  public init() {}

  public dispose() {
    this.mutationDataSource.dispose()
  }

  private async fetchTable(tableId: string): Promise<TableFetchResult | null> {
    const fetchDataSource = container.get(TableFetchDataSource)

    try {
      return await fetchDataSource.fetch({
        revisionId: this.revisionId,
        tableId,
      })
    } finally {
      fetchDataSource.dispose()
    }
  }

  private refreshTableList(): void {
    this.tableListRefreshService.refresh()
  }
}
