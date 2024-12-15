import { RowReferencesByQueryVariables } from 'src/shared/model/BackendStore/api/queries/__generated__/row-references-by.generated.ts'
import { rowReferencesByMstRequest } from 'src/shared/model/BackendStore/api/rowReferencesByMstRequest.ts'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformConnectionVersionId } from 'src/shared/model/BackendStore/utils/transformConnection.ts'

export type QueryRowReferencesByHandlerVariables = RowReferencesByQueryVariables

export type QueryRowReferencesByHandlerType = IQueryHandler<QueryRowReferencesByHandlerVariables, void>

export class QueryRowReferencesByHandler implements QueryRowReferencesByHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryRowReferencesByHandlerVariables) {
    const result = await rowReferencesByMstRequest(variables)

    if (!result.row) {
      throw new Error('Invalid row')
    }

    const connectionSnapshot = transformConnectionVersionId(result.row.rowReferencesBy)

    result.row.rowReferencesBy.edges.forEach(({ node }) => {
      const row = this.store.cache.addRow(node)

      this.store.cache.addRowByVariables(
        {
          revisionId: variables.data.revisionId,
          tableId: variables.referenceData.referenceTableId,
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

    const rowReferencesByConnection = row?.getOrCreateRowReferencesByConnection(
      variables.referenceData.referenceTableId,
    )

    if (!variables.referenceData.after) {
      rowReferencesByConnection?.reset()
    }
    rowReferencesByConnection?.onLoad({
      edges: connectionSnapshot.edges,
      hasNextPage: connectionSnapshot.pageInfo.hasNextPage,
      totalCount: connectionSnapshot.totalCount,
    })
  }
}
