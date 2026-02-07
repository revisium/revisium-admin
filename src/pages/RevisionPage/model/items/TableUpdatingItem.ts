import { UpdatingEditorVM, type JsonObjectSchema } from '@revisium/schema-toolkit-ui'
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
  public readonly viewModel: UpdatingEditorVM

  private readonly updateTableCommand: UpdateTableCommand

  constructor(
    protected override readonly deps: TableUpdatingItemDeps,
    isSelectingForeignKey: boolean,
    schema: JsonObjectSchema,
    tableId: string,
  ) {
    super(deps, isSelectingForeignKey)

    this.updateTableCommand = new UpdateTableCommand({
      mutationDataSource: deps.mutationDataSource,
      tableListRefreshService: deps.tableListRefreshService,
      projectContext: deps.projectContext,
    })

    this.viewModel = new UpdatingEditorVM(schema, {
      tableId,
      collapseComplexSchemas: true,
      onApprove: this.handleApprove,
      onCancel: this.toList,
      onSelectForeignKey: this.handleSelectForeignKey,
    })
  }

  private readonly handleApprove = async (): Promise<boolean> => {
    return this.updateTableCommand.execute(this.viewModel)
  }

  private readonly handleSelectForeignKey = (): Promise<string | null> => {
    return new Promise((resolve) => {
      this.startForeignKeySelection(resolve)
    })
  }

  public override dispose(): void {
    this.viewModel.dispose()
    this.deps.mutationDataSource.dispose()
  }
}
