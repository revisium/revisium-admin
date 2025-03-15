import {
  TablesMstQuery,
  TablesMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/tables.generated.ts'
import { tablesMstRequest } from 'src/shared/model/BackendStore/api/tablesMstRequest.ts'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformConnectionVersionId } from 'src/shared/model/BackendStore/utils/transformConnection.ts'

export type QueryTablesHandlerVariables = TablesMstQueryVariables['data']

export type QueryTablesHandlerType = IQueryHandler<QueryTablesHandlerVariables, void>

export class QueryTablesHandler implements QueryTablesHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryTablesHandlerVariables) {
    const result: TablesMstQuery = await tablesMstRequest({ data: { ...variables } })

    const connectionSnapshot = transformConnectionVersionId(result.tables)

    result.tables.edges.forEach(({ node }) => {
      this.store.cache.addOrTable(node)
    })

    const revision = this.store.cache.revision.get(variables.revisionId)

    if (!variables.after) {
      revision?.tablesConnection.reset()
    }
    revision?.tablesConnection.onLoad({
      edges: connectionSnapshot.edges,
      hasNextPage: connectionSnapshot.pageInfo.hasNextPage,
      totalCount: connectionSnapshot.totalCount,
    })
  }
}
