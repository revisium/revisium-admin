import { IEndpointModel } from 'src/shared/model/BackendStore'
import { EndpointMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/endpoint.generated.ts'

export const transformEndpointFragment = (fragment: EndpointMstFragment): Partial<IEndpointModel> => ({
  id: fragment.id,
  createdAt: fragment.createdAt,
  type: fragment.type,
})
