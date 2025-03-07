import { TableForeignKeysByQueryVariables } from 'src/shared/model/BackendStore/api/queries/__generated__/table-foreign-keys-by.generated.ts'
import { tableForeignKeysByMstRequest } from 'src/shared/model/BackendStore/api/tableForeignKeysByMstRequest.ts'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformConnectionVersionId } from 'src/shared/model/BackendStore/utils/transformConnection.ts'

export type QueryTableForeignKeysByHandlerVariables = TableForeignKeysByQueryVariables

export type QueryTableForeignKeysByHandlerType = IQueryHandler<QueryTableForeignKeysByHandlerVariables, void>

export class QueryTableForeignKeysByHandler implements QueryTableForeignKeysByHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryTableForeignKeysByHandlerVariables) {
    const result = await tableForeignKeysByMstRequest(variables)

    if (!result.table) {
      throw new Error('Invalid table')
    }

    const connectionSnapshot = transformConnectionVersionId(result.table.foreignKeysBy)

    result.table.foreignKeysBy.edges.forEach(({ node }) => {
      this.store.cache.addOrTable(node)
    })

    const table = this.store.cache.getTableByVariables(variables.data)

    if (!variables.foreignKeyData.after) {
      table?.foreignKeysByConnection.reset()
    }
    table?.foreignKeysByConnection.onLoad({
      edges: connectionSnapshot.edges,
      hasNextPage: connectionSnapshot.pageInfo.hasNextPage,
      totalCount: connectionSnapshot.totalCount,
    })
  }
}
