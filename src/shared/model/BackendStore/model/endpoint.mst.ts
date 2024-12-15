import { types } from 'mobx-state-tree'
import { EndpointType } from 'src/__generated__/globalTypes.ts'
import { ISODate } from 'src/shared/model/BackendStore/index.ts'

export const EndpointModel = types.model('EndpointModel', {
  id: types.identifier,
  createdAt: types.late(() => ISODate),
  type: types.enumeration('EndpointType', ['GRAPHQL', 'REST_API']),
})

export type IEndpointModel = Readonly<{ id: string; createdAt: Date | string; type: EndpointType }>
