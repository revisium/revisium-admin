import { IRowModel } from 'src/shared/model/BackendStore'
import { RowMstQueryVariables } from 'src/shared/model/BackendStore/api/queries/__generated__/row.generated.ts'
import { rowMstRequest } from 'src/shared/model/BackendStore/api/rowMstRequest.ts'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformRowFragment } from 'src/shared/model/BackendStore/utils/transformRowFragment.ts'

export type QueryRowHandlerVariables = RowMstQueryVariables['data']

export type QueryRowHandlerType = IQueryHandler<QueryRowHandlerVariables, IRowModel | undefined>

export class QueryRowHandler implements QueryRowHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryRowHandlerVariables) {
    const { row: rowSnapshot } = await rowMstRequest({ data: variables })

    if (rowSnapshot) {
      const cacheVariables = {
        revisionId: variables.revisionId,
        tableId: variables.tableId,
        rowId: variables.rowId,
      }

      const row = this.store.cache.addRow(transformRowFragment(rowSnapshot))
      this.store.cache.addRowByVariables(cacheVariables, row.versionId)

      return row
    }
  }
}
