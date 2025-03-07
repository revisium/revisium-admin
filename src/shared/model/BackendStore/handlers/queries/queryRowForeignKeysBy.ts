import { RowForeignKeysByQueryVariables } from 'src/shared/model/BackendStore/api/queries/__generated__/row-foreign-keys-by.generated.ts'
import { rowForeignKeysByMstRequest } from 'src/shared/model/BackendStore/api/rowForeignKeysByMstRequest.ts'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformConnectionVersionId } from 'src/shared/model/BackendStore/utils/transformConnection.ts'

export type QueryRowForeignKeysByHandlerVariables = RowForeignKeysByQueryVariables

export type QueryRowForeignKeysByHandlerType = IQueryHandler<QueryRowForeignKeysByHandlerVariables, void>

export class QueryRowForeignKeysByHandler implements QueryRowForeignKeysByHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryRowForeignKeysByHandlerVariables) {
    const result = await rowForeignKeysByMstRequest(variables)

    if (!result.row) {
      throw new Error('Invalid row')
    }

    const connectionSnapshot = transformConnectionVersionId(result.row.rowForeignKeysBy)

    result.row.rowForeignKeysBy.edges.forEach(({ node }) => {
      const row = this.store.cache.addRow(node)

      this.store.cache.addRowByVariables(
        {
          revisionId: variables.data.revisionId,
          tableId: variables.foreignKeyData.foreignKeyTableId,
          rowId: row.id,
        },
        row.versionId,
      )
    })

    const row = this.store.cache.getRowByVariables({
      revisionId: variables.data.revisionId,
      tableId: variables.data.tableId,
      rowId: variables.data.rowId,
    })

    const rowForeignKeysByConnection = row?.getOrCreateRowForeignKeysByConnection(
      variables.foreignKeyData.foreignKeyTableId,
    )

    if (!variables.foreignKeyData.after) {
      rowForeignKeysByConnection?.reset()
    }
    rowForeignKeysByConnection?.onLoad({
      edges: connectionSnapshot.edges,
      hasNextPage: connectionSnapshot.pageInfo.hasNextPage,
      totalCount: connectionSnapshot.totalCount,
    })
  }
}
