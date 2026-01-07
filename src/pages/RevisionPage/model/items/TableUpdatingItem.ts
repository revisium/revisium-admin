import { action, makeObservable } from 'mobx'
import { RootNodeStore } from 'src/widgets/SchemaEditor/model/RootNodeStore.ts'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'
import { UpdateTableCommand } from '../commands'
import { TableStackItemType } from '../../config/types.ts'
import { TableStackItemBaseDeps } from './TableStackItemBase.ts'
import { TableEditorItemBase } from './TableEditorItemBase.ts'

export interface TableUpdatingItemDeps extends TableStackItemBaseDeps {
  mutationDataSource: TableMutationDataSource
  tableListRefreshService: TableListRefreshService
}

export class TableUpdatingItem extends TableEditorItemBase {
  public readonly type = TableStackItemType.Updating
  public readonly store: RootNodeStore

  private readonly updateTableCommand: UpdateTableCommand

  constructor(
    protected override readonly deps: TableUpdatingItemDeps,
    isSelectingForeignKey: boolean,
    store: RootNodeStore,
  ) {
    super(deps, isSelectingForeignKey)
    this.store = store

    this.updateTableCommand = new UpdateTableCommand({
      mutationDataSource: deps.mutationDataSource,
      tableListRefreshService: deps.tableListRefreshService,
      projectContext: deps.projectContext,
    })

    makeObservable(this, {
      approve: action.bound,
    })
  }

  public async approve(): Promise<void> {
    const result = await this.updateTableCommand.execute(this.store)

    if (result) {
      this.store.submitChanges()
    }
  }

  public override dispose(): void {
    this.deps.mutationDataSource.dispose()
  }
}
