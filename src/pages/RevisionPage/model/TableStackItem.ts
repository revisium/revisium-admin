import { action, computed, makeObservable, observable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonSchema } from 'src/entities/Schema'
import { StackItem } from 'src/shared/lib/Stack'
import { RootNodeStore } from 'src/widgets/SchemaEditor/model/RootNodeStore.ts'
import { createSchemaNode } from 'src/widgets/SchemaEditor/lib/createSchemaNode.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { TableFetchDataSource, TableFetchResult } from 'src/pages/RevisionPage/model/TableFetchDataSource.ts'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'
import {
  SelectForeignKeyPayload,
  SelectForeignKeyResult,
  TableStackState,
  TableStackStateType,
} from '../config/types.ts'
import { CreateTableCommand, UpdateTableCommand } from './commands'

export interface TableStackItemDeps {
  projectContext: ProjectContext
  permissionContext: PermissionContext
  mutationDataSource: TableMutationDataSource
  tableListRefreshService: TableListRefreshService
  fetchDataSourceFactory: () => TableFetchDataSource
}

export class TableStackItem extends StackItem<TableStackState> {
  private readonly createTableCommand: CreateTableCommand
  private readonly updateTableCommand: UpdateTableCommand

  private savedStateBeforeConnecting: {
    type: TableStackStateType.Creating | TableStackStateType.Updating
    store: RootNodeStore
  } | null = null

  constructor(
    private readonly deps: TableStackItemDeps,
    initialState: TableStackState,
  ) {
    super(initialState)

    this.createTableCommand = new CreateTableCommand({
      mutationDataSource: deps.mutationDataSource,
      tableListRefreshService: deps.tableListRefreshService,
      projectContext: deps.projectContext,
    })

    this.updateTableCommand = new UpdateTableCommand({
      mutationDataSource: deps.mutationDataSource,
      tableListRefreshService: deps.tableListRefreshService,
      projectContext: deps.projectContext,
    })

    makeObservable<TableStackItem, 'savedStateBeforeConnecting'>(this, {
      savedStateBeforeConnecting: observable,
      isEditableRevision: computed,
      canCreateTable: computed,
      revisionId: computed,
      toList: action,
      toCreating: action,
      toUpdating: action,
      restoreStateAfterForeignKey: action,
    })
  }

  public get isEditableRevision(): boolean {
    return this.deps.projectContext.isDraftRevision
  }

  public get canCreateTable(): boolean {
    return this.isEditableRevision && this.deps.permissionContext.canCreateTable
  }

  public get revisionId(): string {
    return this.deps.projectContext.revision.id
  }

  public toList(): void {
    this.state = { type: TableStackStateType.List }
  }

  public toCreating(): void {
    this.state = {
      type: TableStackStateType.Creating,
      store: new RootNodeStore(),
    }
  }

  public async toCloning(tableId: string): Promise<void> {
    const table = await this.fetchTable(tableId)

    if (!table) {
      throw new Error(`Not found table ${tableId}`)
    }

    const root = createSchemaNode(table.schema as JsonSchema, { collapse: true })
    const store = new RootNodeStore(root, table.id)

    this.state = {
      type: TableStackStateType.Creating,
      store,
    }
  }

  public async toUpdating(tableId: string): Promise<void> {
    const table = await this.fetchTable(tableId)

    if (!table) {
      throw new Error(`Not found table ${tableId}`)
    }

    const root = createSchemaNode(table.schema as JsonSchema, { collapse: true })
    root.setId(table.id)
    root.submitChanges()

    const store = new RootNodeStore(root, table.id)

    this.state = {
      type: TableStackStateType.Updating,
      store,
    }
  }

  public saveStateForForeignKey(): void {
    if (this.state.type === TableStackStateType.Creating || this.state.type === TableStackStateType.Updating) {
      this.savedStateBeforeConnecting = {
        type: this.state.type,
        store: this.state.store,
      }
    }
  }

  public restoreStateAfterForeignKey(): void {
    if (this.savedStateBeforeConnecting) {
      this.state = {
        type: this.savedStateBeforeConnecting.type,
        store: this.savedStateBeforeConnecting.store,
      }
      this.savedStateBeforeConnecting = null
    }
  }

  public applyForeignKeyResult(payload: SelectForeignKeyPayload, result: SelectForeignKeyResult): void {
    if (this.savedStateBeforeConnecting) {
      this.savedStateBeforeConnecting.store.setForeignKeyValue(payload.foreignKeyNode, result)
    }
  }

  public async createTable(tableId: string, schema: JsonSchema): Promise<boolean> {
    return this.createTableCommand.execute(tableId, schema)
  }

  public async updateTable(store: RootNodeStore): Promise<boolean> {
    return this.updateTableCommand.execute(store)
  }

  public override dispose(): void {
    this.deps.mutationDataSource.dispose()
  }

  private async fetchTable(tableId: string): Promise<TableFetchResult | null> {
    const fetchDataSource = this.deps.fetchDataSourceFactory()

    try {
      return await fetchDataSource.fetch({
        revisionId: this.revisionId,
        tableId,
      })
    } finally {
      fetchDataSource.dispose()
    }
  }
}
