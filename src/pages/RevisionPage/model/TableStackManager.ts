import { action, makeObservable } from 'mobx'
import { container } from 'src/shared/lib/DIContainer.ts'
import { StackManager, StackRequest } from 'src/shared/lib/Stack'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor/model/StringForeignKeyNodeStore.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'
import { TableFetchDataSource } from 'src/pages/RevisionPage/model/TableFetchDataSource.ts'
import { TableStackItem, TableStackItemDeps } from './TableStackItem.ts'
import { SelectForeignKeyPayload, SelectForeignKeyResult, TableStackStateType } from '../config/types.ts'

export class TableStackManager extends StackManager<TableStackItem, SelectForeignKeyPayload, SelectForeignKeyResult> {
  constructor(private readonly deps: TableStackItemDeps) {
    const firstItem = new TableStackItem(deps, { type: TableStackStateType.List })
    super(firstItem)

    makeObservable(this, {
      selectForeignKey: action,
    })
  }

  public selectForeignKey(item: TableStackItem, foreignKeyNode: StringForeignKeyNodeStore): void {
    item.saveStateForForeignKey()

    const payload: SelectForeignKeyPayload = { foreignKeyNode }

    this.pushRequest(
      item,
      payload,
      (result: SelectForeignKeyResult) => {
        item.applyForeignKeyResult(payload, result)
        item.restoreStateAfterForeignKey()
      },
      () => {
        item.restoreStateAfterForeignKey()
      },
    )
  }

  protected createItemForRequest(
    _request: StackRequest<SelectForeignKeyPayload, SelectForeignKeyResult>,
  ): TableStackItem {
    return new TableStackItem(this.deps, { type: TableStackStateType.List })
  }
}

container.register(
  TableStackManager,
  () => {
    const deps: TableStackItemDeps = {
      projectContext: container.get(ProjectContext),
      permissionContext: container.get(PermissionContext),
      mutationDataSource: container.get(TableMutationDataSource),
      tableListRefreshService: container.get(TableListRefreshService),
      fetchDataSourceFactory: () => container.get(TableFetchDataSource),
    }
    return new TableStackManager(deps)
  },
  { scope: 'request' },
)
