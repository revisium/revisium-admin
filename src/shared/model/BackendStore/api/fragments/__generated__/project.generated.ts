// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { BranchMstFragmentDoc } from './branch.generated'
export type ProjectMstFragment = {
  __typename?: 'ProjectModel'
  id: string
  organizationId: string
  createdAt: string
  name: string
  isPublic: boolean
  rootBranch: {
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
}

export const ProjectMstFragmentDoc = gql`
  fragment ProjectMst on ProjectModel {
    id
    organizationId
    createdAt
    name
    isPublic
    rootBranch {
      ...BranchMst
    }
  }
  ${BranchMstFragmentDoc}
`
