import { getRowCountForeignKeysByMstRequest } from 'src/shared/model/BackendStore/api/getRowCountForeignKeysByMstRequest.ts'
import { GetRowCountForeignKeysToQueryVariables } from 'src/shared/model/BackendStore/api/queries/__generated__/get-row-count-foreign-keys-by.generated.ts'
import { IRowForeignKeysByModel } from 'src/shared/model/BackendStore/model'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'

export type QueryGetRowCountForeignKeysByHandlerVariables = GetRowCountForeignKeysToQueryVariables['data']

export type QueryGetRowCountForeignKeysByHandlerType = IQueryHandler<
  QueryGetRowCountForeignKeysByHandlerVariables,
  IRowForeignKeysByModel
>

export class QueryGetRowCountForeignKeysByHandler implements QueryGetRowCountForeignKeysByHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryGetRowCountForeignKeysByHandlerVariables) {
    const { getRowCountForeignKeysTo: count } = await getRowCountForeignKeysByMstRequest({ data: variables })

    const cacheVariables = {
      revisionId: variables.revisionId,
      tableId: variables.tableId,
      rowId: variables.rowId,
    }

    const rowForeignKeysBy =
      this.store.cache.getRowForeignKeysByVariables(cacheVariables) ||
      this.store.cache.createRowForeignKeysByByVariables(cacheVariables)

    rowForeignKeysBy.update({
      countForeignKeysBy: count,
    })

    return rowForeignKeysBy
  }
}
