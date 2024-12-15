// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { RevisionStartMstFragmentDoc, RevisionMstFragmentDoc, RevisionDraftMstFragmentDoc } from './revision.generated'
export type BranchMstFragment = {
  __typename?: 'BranchModel'
  id: string
  createdAt: string
  name: string
  touched: boolean
  projectId: string
  parent?: {
    __typename?: 'ParentBranchModel'
    branch: { __typename?: 'BranchModel'; id: string; name: string }
    revision: { __typename?: 'RevisionModel'; id: string }
  } | null
  start: {
    __typename?: 'RevisionModel'
    id: string
    createdAt: string
    comment: string
    child?: { __typename?: 'RevisionModel'; id: string } | null
    childBranches: Array<{
      __typename?: 'ChildBranchModel'
      branch: { __typename?: 'BranchModel'; id: string; name: string }
      revision: { __typename?: 'RevisionModel'; id: string }
    }>
    endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
  }
  head: {
    __typename?: 'RevisionModel'
    id: string
    createdAt: string
    comment: string
    parent?: { __typename?: 'RevisionModel'; id: string } | null
    child?: { __typename?: 'RevisionModel'; id: string } | null
    childBranches: Array<{
      __typename?: 'ChildBranchModel'
      branch: { __typename?: 'BranchModel'; id: string; name: string }
      revision: { __typename?: 'RevisionModel'; id: string }
    }>
    endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
  }
  draft: {
    __typename?: 'RevisionModel'
    id: string
    createdAt: string
    comment: string
    parent?: { __typename?: 'RevisionModel'; id: string } | null
    endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
  }
}

export const BranchMstFragmentDoc = gql`
  fragment BranchMst on BranchModel {
    id
    createdAt
    name
    touched
    projectId
    parent {
      branch {
        id
        name
      }
      revision {
        id
      }
    }
    start {
      ...RevisionStartMst
    }
    head {
      ...RevisionMst
    }
    draft {
      ...RevisionDraftMst
    }
  }
  ${RevisionStartMstFragmentDoc}
  ${RevisionMstFragmentDoc}
  ${RevisionDraftMstFragmentDoc}
`
