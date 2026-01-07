import { action, makeObservable } from 'mobx'
import { RootNodeStore } from 'src/widgets/SchemaEditor/model/RootNodeStore.ts'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'
import { CreateTableCommand } from '../commands'
import { TableStackItemType } from '../../config/types.ts'
import { TableStackItemBaseDeps } from './TableStackItemBase.ts'
import { TableEditorItemBase } from './TableEditorItemBase.ts'

export interface TableCreatingItemDeps extends TableStackItemBaseDeps {
  mutationDataSource: TableMutationDataSource
  tableListRefreshService: TableListRefreshService
}

export class TableCreatingItem extends TableEditorItemBase {
  public readonly type = TableStackItemType.Creating
  public readonly store: RootNodeStore

  private readonly createTableCommand: CreateTableCommand

  constructor(
    protected override readonly deps: TableCreatingItemDeps,
    isSelectingForeignKey: boolean,
    store: RootNodeStore = new RootNodeStore(),
  ) {
    super(deps, isSelectingForeignKey)
    this.store = store

    this.createTableCommand = new CreateTableCommand({
      mutationDataSource: deps.mutationDataSource,
      tableListRefreshService: deps.tableListRefreshService,
      projectContext: deps.projectContext,
    })

    makeObservable(this, {
      approve: action.bound,
      toUpdating: action.bound,
      selectTable: action.bound,
    })
  }

  public async approve(): Promise<void> {
    const result = await this.createTableCommand.execute(this.store.draftTableId, this.store.getPlainSchema())

    if (result) {
      this.store.submitChanges()
      if (this.isSelectingForeignKey) {
        this.selectTable(this.store.draftTableId)
      } else {
        this.toUpdating()
      }
    }
  }

  public toUpdating(): void {
    this.resolve({ type: 'creatingToUpdating' })
  }

  public selectTable(tableId: string): void {
    this.resolve({ type: 'selectTable', tableId })
  }

  public override dispose(): void {
    this.deps.mutationDataSource.dispose()
  }
}
