// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { PageInfoMstFragmentDoc } from '../../fragments/__generated__/page-info.generated'
import { BranchMstFragmentDoc } from '../../fragments/__generated__/branch.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type BranchesMstQueryVariables = Types.Exact<{
  data: Types.GetBranchesInput
}>

export type BranchesMstQuery = {
  __typename?: 'Query'
  branches: {
    __typename?: 'BranchesConnection'
    totalCount: number
    pageInfo: {
      __typename?: 'PageInfo'
      startCursor?: string | null
      endCursor?: string | null
      hasPreviousPage: boolean
      hasNextPage: boolean
    }
    edges: Array<{
      __typename?: 'BranchModelEdge'
      cursor: string
      node: {
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
    }>
  }
}

export const BranchesMstDocument = gql`
  query BranchesMst($data: GetBranchesInput!) {
    branches(data: $data) {
      totalCount
      pageInfo {
        ...PageInfoMst
      }
      edges {
        cursor
        node {
          ...BranchMst
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${BranchMstFragmentDoc}
`

/**
 * __useBranchesMstQuery__
 *
 * To run a query within a React component, call `useBranchesMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useBranchesMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBranchesMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useBranchesMstQuery(
  baseOptions: Apollo.QueryHookOptions<BranchesMstQuery, BranchesMstQueryVariables> &
    ({ variables: BranchesMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<BranchesMstQuery, BranchesMstQueryVariables>(BranchesMstDocument, options)
}
export function useBranchesMstLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<BranchesMstQuery, BranchesMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<BranchesMstQuery, BranchesMstQueryVariables>(BranchesMstDocument, options)
}
export function useBranchesMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<BranchesMstQuery, BranchesMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<BranchesMstQuery, BranchesMstQueryVariables>(BranchesMstDocument, options)
}
export type BranchesMstQueryHookResult = ReturnType<typeof useBranchesMstQuery>
export type BranchesMstLazyQueryHookResult = ReturnType<typeof useBranchesMstLazyQuery>
export type BranchesMstSuspenseQueryHookResult = ReturnType<typeof useBranchesMstSuspenseQuery>
export type BranchesMstQueryResult = Apollo.QueryResult<BranchesMstQuery, BranchesMstQueryVariables>
