import { ITableModel } from 'src/shared/model/BackendStore'
import { TableMstQueryVariables } from 'src/shared/model/BackendStore/api/queries/__generated__/table.generated.ts'
import { tableMstRequest } from 'src/shared/model/BackendStore/api/tableMstRequest.ts'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformTableFragment } from 'src/shared/model/BackendStore/utils/transformTableFragment.ts'

export type QueryTableHandlerVariables = TableMstQueryVariables

export type QueryTableHandlerType = IQueryHandler<QueryTableHandlerVariables, ITableModel | undefined>

export class QueryTableHandler implements QueryTableHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryTableHandlerVariables) {
    const { table: tableSnapshot } = await tableMstRequest(variables)

    if (tableSnapshot) {
      const table = this.store.cache.addOrTable(transformTableFragment(tableSnapshot))
      this.store.cache.addTableByVariables(
        { revisionId: variables.data.revisionId, tableId: variables.data.tableId },
        table.versionId,
      )

      return table
    }
  }
}
