import { IRevisionModel } from 'src/shared/model/BackendStore'
import { RevisionMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/revision.generated.ts'
import { ICacheModel } from 'src/shared/model/BackendStore/cache.mst.ts'
import { transformEndpointFragment } from 'src/shared/model/BackendStore/utils/transformEndpointFragment.ts'
import { transformRevisionFragment } from 'src/shared/model/BackendStore/utils/transformRevisionFragment.ts'

export const addRevisionFragmentToCache = (
  cache: ICacheModel,
  revisionFragment: RevisionMstFragment,
): IRevisionModel => {
  revisionFragment.endpoints.map((endpointSnapshot) => cache.addEndpoint(transformEndpointFragment(endpointSnapshot)))
  return cache.addOrUpdateRevision(transformRevisionFragment(revisionFragment))
}
