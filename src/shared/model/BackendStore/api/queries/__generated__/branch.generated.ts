// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { BranchMstFragmentDoc } from '../../fragments/__generated__/branch.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type BranchMstQueryVariables = Types.Exact<{
  data: Types.GetBranchInput
}>

export type BranchMstQuery = {
  __typename?: 'Query'
  branch: {
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

export const BranchMstDocument = gql`
  query BranchMst($data: GetBranchInput!) {
    branch(data: $data) {
      ...BranchMst
    }
  }
  ${BranchMstFragmentDoc}
`

/**
 * __useBranchMstQuery__
 *
 * To run a query within a React component, call `useBranchMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useBranchMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBranchMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useBranchMstQuery(
  baseOptions: Apollo.QueryHookOptions<BranchMstQuery, BranchMstQueryVariables> &
    ({ variables: BranchMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<BranchMstQuery, BranchMstQueryVariables>(BranchMstDocument, options)
}
export function useBranchMstLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<BranchMstQuery, BranchMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<BranchMstQuery, BranchMstQueryVariables>(BranchMstDocument, options)
}
export function useBranchMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<BranchMstQuery, BranchMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<BranchMstQuery, BranchMstQueryVariables>(BranchMstDocument, options)
}
export type BranchMstQueryHookResult = ReturnType<typeof useBranchMstQuery>
export type BranchMstLazyQueryHookResult = ReturnType<typeof useBranchMstLazyQuery>
export type BranchMstSuspenseQueryHookResult = ReturnType<typeof useBranchMstSuspenseQuery>
export type BranchMstQueryResult = Apollo.QueryResult<BranchMstQuery, BranchMstQueryVariables>
