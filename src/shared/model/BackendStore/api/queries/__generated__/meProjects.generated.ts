// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { PageInfoMstFragmentDoc } from '../../fragments/__generated__/page-info.generated'
import { ProjectMstFragmentDoc } from '../../fragments/__generated__/project.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type MeProjectsMstQueryVariables = Types.Exact<{
  data: Types.GetMeProjectsInput
}>

export type MeProjectsMstQuery = {
  __typename?: 'Query'
  meProjects: {
    __typename?: 'ProjectsConnection'
    totalCount: number
    pageInfo: {
      __typename?: 'PageInfo'
      startCursor?: string | null
      endCursor?: string | null
      hasPreviousPage: boolean
      hasNextPage: boolean
    }
    edges: Array<{
      __typename?: 'ProjectModelEdge'
      cursor: string
      node: {
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
    }>
  }
}

export const MeProjectsMstDocument = gql`
  query meProjectsMst($data: GetMeProjectsInput!) {
    meProjects(data: $data) {
      totalCount
      pageInfo {
        ...PageInfoMst
      }
      edges {
        cursor
        node {
          ...ProjectMst
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${ProjectMstFragmentDoc}
`

/**
 * __useMeProjectsMstQuery__
 *
 * To run a query within a React component, call `useMeProjectsMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeProjectsMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeProjectsMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMeProjectsMstQuery(
  baseOptions: Apollo.QueryHookOptions<MeProjectsMstQuery, MeProjectsMstQueryVariables> &
    ({ variables: MeProjectsMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MeProjectsMstQuery, MeProjectsMstQueryVariables>(MeProjectsMstDocument, options)
}
export function useMeProjectsMstLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeProjectsMstQuery, MeProjectsMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MeProjectsMstQuery, MeProjectsMstQueryVariables>(MeProjectsMstDocument, options)
}
export function useMeProjectsMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<MeProjectsMstQuery, MeProjectsMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MeProjectsMstQuery, MeProjectsMstQueryVariables>(MeProjectsMstDocument, options)
}
export type MeProjectsMstQueryHookResult = ReturnType<typeof useMeProjectsMstQuery>
export type MeProjectsMstLazyQueryHookResult = ReturnType<typeof useMeProjectsMstLazyQuery>
export type MeProjectsMstSuspenseQueryHookResult = ReturnType<typeof useMeProjectsMstSuspenseQuery>
export type MeProjectsMstQueryResult = Apollo.QueryResult<MeProjectsMstQuery, MeProjectsMstQueryVariables>
