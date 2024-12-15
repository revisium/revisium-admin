// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
export type EndpointMstFragment = {
  __typename?: 'EndpointModel'
  id: string
  type: Types.EndpointType
  createdAt: string
}

export const EndpointMstFragmentDoc = gql`
  fragment EndpointMst on EndpointModel {
    id
    type
    createdAt
  }
`
