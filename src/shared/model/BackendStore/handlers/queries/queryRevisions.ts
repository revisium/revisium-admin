import {
  RevisionsMstQuery,
  RevisionsMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/revisions.generated.ts'
import { revisionsMstRequest } from 'src/shared/model/BackendStore/api/revisionsMstRequest.ts'
import { IQueryHandler, IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { addRevisionFragmentToCache } from 'src/shared/model/BackendStore/utils/addRevisionFragmentToCache.ts'

export type QueryRevisionsHandlerVariables = RevisionsMstQueryVariables

export type QueryRevisionsHandlerType = IQueryHandler<QueryRevisionsHandlerVariables, void>

export class QueryRevisionsHandler implements QueryRevisionsHandlerType {
  constructor(private readonly store: IRootStore) {}

  public async execute(variables: QueryRevisionsHandlerVariables) {
    const result: RevisionsMstQuery = await revisionsMstRequest(variables)

    result.branch.revisions.edges.forEach(({ node }) => {
      addRevisionFragmentToCache(this.store.cache, node)
    })
  }
}
