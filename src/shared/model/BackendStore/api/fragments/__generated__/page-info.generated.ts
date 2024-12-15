// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
export type PageInfoMstFragment = {
  __typename?: 'PageInfo'
  startCursor?: string | null
  endCursor?: string | null
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export const PageInfoMstFragmentDoc = gql`
  fragment PageInfoMst on PageInfo {
    startCursor
    endCursor
    hasPreviousPage
    hasNextPage
  }
`
