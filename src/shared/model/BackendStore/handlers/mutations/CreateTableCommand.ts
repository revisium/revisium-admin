import { JsonSchema } from 'src/entities/Schema'
import { IBranchModel } from 'src/shared/model/BackendStore'
import { createTableMstRequest } from 'src/shared/model/BackendStore/api/createTableMstRequest.ts'
import { TableMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/table.generated.ts'
import { CreateTableMstMutation } from 'src/shared/model/BackendStore/api/mutations/__generated__/createTable.generated.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformTableFragment } from 'src/shared/model/BackendStore/utils/transformTableFragment.ts'

export class CreateTableCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly branch: IBranchModel,
    private readonly tableId: string,
    private readonly schema: JsonSchema,
  ) {}

  public async execute() {
    const table = await this.createTableRequest()

    await this.refetchTablesConnection()

    if (!this.branch.touched) {
      this.branch.updateTouched(true)
    }

    return table
  }

  private async createTableRequest() {
    const { createTable }: CreateTableMstMutation = await createTableMstRequest({
      data: { revisionId: this.branch.draft.id, tableId: this.tableId, schema: this.schema },
    })

    return this.addTableToCache(createTable.table)
  }

  private addTableToCache(tableFragment: TableMstFragment) {
    const responseTable = this.rootStore.cache.addOrTable(transformTableFragment(tableFragment))
    this.rootStore.cache.addTableByVariables(
      { revisionId: this.branch.draft.id, tableId: responseTable.id },
      responseTable.versionId,
    )

    return responseTable
  }

  private async refetchTablesConnection() {
    await this.rootStore.queryTables({ revisionId: this.branch.draft.id, first: 50 })
  }
}
