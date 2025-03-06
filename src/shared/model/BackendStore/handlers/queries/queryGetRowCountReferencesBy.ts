import { getRowCountReferencesByMstRequest } from 'src/shared/model/BackendStore/api/getRowCountReferencesByMstRequest.ts'
import { GetRowCountReferencesToQueryVariables } from 'src/shared/model/BackendStore/api/queries/__generated__/get-row-count-references-by.generated.ts'
import { IRowRefsByModel } from 'src/shared/model/BackendStore/model'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'

export type QueryGetRowCountReferencesByHandlerVariables = GetRowCountReferencesToQueryVariables['data']

export type QueryGetRowCountReferencesByHandlerType = IQueryHandler<
  QueryGetRowCountReferencesByHandlerVariables,
  IRowRefsByModel
>

export class QueryGetRowCountReferencesByHandler implements QueryGetRowCountReferencesByHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryGetRowCountReferencesByHandlerVariables) {
    const { getRowCountForeignKeysTo: count } = await getRowCountReferencesByMstRequest({ data: variables })

    const cacheVariables = {
      revisionId: variables.revisionId,
      tableId: variables.tableId,
      rowId: variables.rowId,
    }

    const rowRefsBy =
      this.store.cache.getRowRefsByVariables(cacheVariables) ||
      this.store.cache.createRowRefsByByVariables(cacheVariables)

    rowRefsBy.update({
      countReferencesBy: count,
    })

    return rowRefsBy
  }
}
