// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { EndpointMstFragmentDoc } from './endpoint.generated'
export type RevisionMstFragment = {
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

export type RevisionStartMstFragment = {
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

export type RevisionDraftMstFragment = {
  __typename?: 'RevisionModel'
  id: string
  createdAt: string
  comment: string
  parent?: { __typename?: 'RevisionModel'; id: string } | null
  endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
}

export const RevisionMstFragmentDoc = gql`
  fragment RevisionMst on RevisionModel {
    id
    createdAt
    comment
    parent {
      id
    }
    child {
      id
    }
    childBranches {
      branch {
        id
        name
      }
      revision {
        id
      }
    }
    endpoints {
      ...EndpointMst
    }
  }
  ${EndpointMstFragmentDoc}
`
export const RevisionStartMstFragmentDoc = gql`
  fragment RevisionStartMst on RevisionModel {
    id
    createdAt
    comment
    child {
      id
    }
    childBranches {
      branch {
        id
        name
      }
      revision {
        id
      }
    }
    endpoints {
      ...EndpointMst
    }
  }
  ${EndpointMstFragmentDoc}
`
export const RevisionDraftMstFragmentDoc = gql`
  fragment RevisionDraftMst on RevisionModel {
    id
    createdAt
    comment
    parent {
      id
    }
    endpoints {
      ...EndpointMst
    }
  }
  ${EndpointMstFragmentDoc}
`
