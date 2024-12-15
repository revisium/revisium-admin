import {
  RowsMstQueryVariables,
  RowsMstQuery,
} from 'src/shared/model/BackendStore/api/queries/__generated__/rows.generated.ts'
import { rowsMstRequest } from 'src/shared/model/BackendStore/api/rowsMstRequest.ts'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformConnectionVersionId } from 'src/shared/model/BackendStore/utils/transformConnection.ts'

export type QueryRowsHandlerVariables = RowsMstQueryVariables['data']

export type QueryRowsHandlerType = IQueryHandler<QueryRowsHandlerVariables, void>

export class QueryRowsHandler implements QueryRowsHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryRowsHandlerVariables) {
    const result: RowsMstQuery = await rowsMstRequest({ data: { ...variables } })

    const connectionSnapshot = transformConnectionVersionId(result.rows)

    result.rows.edges.forEach(({ node }) => {
      const row = this.store.cache.addRow(node)

      this.store.cache.addRowByVariables(
        {
          revisionId: variables.revisionId,
          tableId: variables.tableId,
          rowId: row.id,
        },
        row.versionId,
      )
    })

    const table = this.store.cache.getTableByVariables({ revisionId: variables.revisionId, tableId: variables.tableId })

    if (!variables.after) {
      table?.rowsConnection.reset()
    }
    table?.rowsConnection.onLoad({
      edges: connectionSnapshot.edges,
      hasNextPage: connectionSnapshot.pageInfo.hasNextPage,
      totalCount: connectionSnapshot.totalCount,
    })
  }
}
