import { action, makeObservable } from 'mobx'
import { CreatingEditorVM, JsonSchemaTypeName, type JsonObjectSchema } from '@revisium/schema-toolkit-ui'
import { TableMutationDataSource } from 'src/pages/RevisionPage/model/TableMutationDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'
import { CreateTableCommand } from '../commands'
import { TableStackItemType } from '../../config/types.ts'
import { TableStackItemBaseDeps } from './TableStackItemBase.ts'
import { TableEditorItemBase } from './TableEditorItemBase.ts'

const DEFAULT_SCHEMA: JsonObjectSchema = {
  type: JsonSchemaTypeName.Object,
  properties: {},
  additionalProperties: false,
  required: [],
}

export interface TableCreatingItemDeps extends TableStackItemBaseDeps {
  mutationDataSource: TableMutationDataSource
  tableListRefreshService: TableListRefreshService
}

export class TableCreatingItem extends TableEditorItemBase {
  public readonly type = TableStackItemType.Creating
  public readonly viewModel: CreatingEditorVM

  private readonly createTableCommand: CreateTableCommand

  constructor(
    protected override readonly deps: TableCreatingItemDeps,
    isSelectingForeignKey: boolean,
    schema: JsonObjectSchema = DEFAULT_SCHEMA,
    tableId: string = '',
  ) {
    super(deps, isSelectingForeignKey)

    this.createTableCommand = new CreateTableCommand({
      mutationDataSource: deps.mutationDataSource,
      tableListRefreshService: deps.tableListRefreshService,
      projectContext: deps.projectContext,
    })

    this.viewModel = new CreatingEditorVM(schema, {
      tableId,
      collapseComplexSchemas: true,
      onApprove: this.handleApprove,
      onCancel: this.toList,
      onSelectForeignKey: this.handleSelectForeignKey,
    })

    makeObservable(this, {
      toUpdating: action.bound,
      selectTable: action.bound,
    })
  }

  private handleApprove = async (): Promise<boolean> => {
    const result = await this.createTableCommand.execute(this.viewModel)

    if (result) {
      if (this.isSelectingForeignKey) {
        this.selectTable(this.viewModel.tableId)
      } else {
        this.toUpdating()
      }
    }

    return result
  }

  private handleSelectForeignKey = (): Promise<string | null> => {
    return new Promise((resolve) => {
      this.startForeignKeySelection(resolve)
    })
  }

  public toUpdating(): void {
    this.resolve({ type: 'creatingToUpdating' })
  }

  public selectTable(tableId: string): void {
    this.resolve({ type: 'selectTable', tableId })
  }

  public override dispose(): void {
    this.viewModel.dispose()
    this.deps.mutationDataSource.dispose()
  }
}
