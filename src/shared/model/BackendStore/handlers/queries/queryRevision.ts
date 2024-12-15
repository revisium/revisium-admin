import { IBackendStore, IRevisionModel } from 'src/shared/model/BackendStore'
import {
  RevisionMstQuery,
  RevisionMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/revision.generated.ts'
import { revisionMstRequest } from 'src/shared/model/BackendStore/api/revisionMstRequest.ts'
import { addRevisionFragmentToCache } from 'src/shared/model/BackendStore/utils/addRevisionFragmentToCache.ts'

export type QueryRevisionHandlerType = (variables: RevisionMstQueryVariables['data']) => Promise<IRevisionModel>

export function getQueryRevisionHandler(self: IBackendStore) {
  return function* queryRevision(variables: RevisionMstQueryVariables['data']) {
    const { revision: revisionFragment }: RevisionMstQuery = yield revisionMstRequest({ data: variables })

    return addRevisionFragmentToCache(self.cache, revisionFragment)
  }
}
