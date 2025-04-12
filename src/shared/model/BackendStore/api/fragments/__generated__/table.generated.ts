// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
export type TableMstFragment = {
  __typename?: 'TableModel'
  createdId: string
  id: string
  versionId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  count: number
  schema: { [key: string]: any } | string | number | boolean | null
}

export const TableMstFragmentDoc = gql`
  fragment TableMst on TableModel {
    createdId
    id
    versionId
    createdAt
    updatedAt
    readonly
    count
    schema
  }
`
