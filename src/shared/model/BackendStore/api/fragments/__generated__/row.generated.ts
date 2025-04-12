// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
export type RowMstFragment = {
  __typename?: 'RowModel'
  createdId: string
  id: string
  versionId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  data: { [key: string]: any } | string | number | boolean | null
}

export const RowMstFragmentDoc = gql`
  fragment RowMst on RowModel {
    createdId
    id
    versionId
    createdAt
    updatedAt
    readonly
    data
  }
`
