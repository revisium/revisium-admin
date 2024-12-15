// @ts-ignore
import * as Types from '../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
export type PageInfoFragment = {
  __typename?: 'PageInfo'
  startCursor?: string | null
  hasNextPage: boolean
  hasPreviousPage: boolean
  endCursor?: string | null
}

export const PageInfoFragmentDoc = gql`
  fragment PageInfo on PageInfo {
    startCursor
    hasNextPage
    hasPreviousPage
    endCursor
  }
`
