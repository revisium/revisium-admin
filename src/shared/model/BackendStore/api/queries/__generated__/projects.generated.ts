// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { PageInfoMstFragmentDoc } from '../../fragments/__generated__/page-info.generated'
import { ProjectMstFragmentDoc } from '../../fragments/__generated__/project.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type ProjectsMstQueryVariables = Types.Exact<{
  data: Types.GetProjectsInput
}>

export type ProjectsMstQuery = {
  __typename?: 'Query'
  projects: {
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

export const ProjectsMstDocument = gql`
  query ProjectsMst($data: GetProjectsInput!) {
    projects(data: $data) {
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
 * __useProjectsMstQuery__
 *
 * To run a query within a React component, call `useProjectsMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectsMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectsMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useProjectsMstQuery(
  baseOptions: Apollo.QueryHookOptions<ProjectsMstQuery, ProjectsMstQueryVariables> &
    ({ variables: ProjectsMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ProjectsMstQuery, ProjectsMstQueryVariables>(ProjectsMstDocument, options)
}
export function useProjectsMstLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProjectsMstQuery, ProjectsMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ProjectsMstQuery, ProjectsMstQueryVariables>(ProjectsMstDocument, options)
}
export function useProjectsMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<ProjectsMstQuery, ProjectsMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ProjectsMstQuery, ProjectsMstQueryVariables>(ProjectsMstDocument, options)
}
export type ProjectsMstQueryHookResult = ReturnType<typeof useProjectsMstQuery>
export type ProjectsMstLazyQueryHookResult = ReturnType<typeof useProjectsMstLazyQuery>
export type ProjectsMstSuspenseQueryHookResult = ReturnType<typeof useProjectsMstSuspenseQuery>
export type ProjectsMstQueryResult = Apollo.QueryResult<ProjectsMstQuery, ProjectsMstQueryVariables>
