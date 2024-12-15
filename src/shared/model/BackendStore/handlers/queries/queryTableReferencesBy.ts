import { TableReferencesByQueryVariables } from 'src/shared/model/BackendStore/api/queries/__generated__/table-references-by.generated.ts'
import { tableReferencesByMstRequest } from 'src/shared/model/BackendStore/api/tableReferencesByMstRequest.ts'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformConnectionVersionId } from 'src/shared/model/BackendStore/utils/transformConnection.ts'

export type QueryTableReferencesByHandlerVariables = TableReferencesByQueryVariables

export type QueryTableReferencesByHandlerType = IQueryHandler<QueryTableReferencesByHandlerVariables, void>

export class QueryTableReferencesByHandler implements QueryTableReferencesByHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryTableReferencesByHandlerVariables) {
    const result = await tableReferencesByMstRequest(variables)

    if (!result.table) {
      throw new Error('Invalid table')
    }

    const connectionSnapshot = transformConnectionVersionId(result.table.referencesBy)

    result.table.referencesBy.edges.forEach(({ node }) => {
      this.store.cache.addOrTable(node)
    })

    const table = this.store.cache.getTableByVariables(variables.data)

    if (!variables.referenceData.after) {
      table?.referencesByConnection.reset()
    }
    table?.referencesByConnection.onLoad({
      edges: connectionSnapshot.edges,
      hasNextPage: connectionSnapshot.pageInfo.hasNextPage,
      totalCount: connectionSnapshot.totalCount,
    })
  }
}
