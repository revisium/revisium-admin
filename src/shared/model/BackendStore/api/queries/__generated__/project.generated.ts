// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { ProjectMstFragmentDoc } from '../../fragments/__generated__/project.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type ProjectMstQueryVariables = Types.Exact<{
  data: Types.GetProjectInput
}>

export type ProjectMstQuery = {
  __typename?: 'Query'
  project: {
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
}

export const ProjectMstDocument = gql`
  query ProjectMst($data: GetProjectInput!) {
    project(data: $data) {
      ...ProjectMst
    }
  }
  ${ProjectMstFragmentDoc}
`

/**
 * __useProjectMstQuery__
 *
 * To run a query within a React component, call `useProjectMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useProjectMstQuery(
  baseOptions: Apollo.QueryHookOptions<ProjectMstQuery, ProjectMstQueryVariables> &
    ({ variables: ProjectMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ProjectMstQuery, ProjectMstQueryVariables>(ProjectMstDocument, options)
}
export function useProjectMstLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProjectMstQuery, ProjectMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ProjectMstQuery, ProjectMstQueryVariables>(ProjectMstDocument, options)
}
export function useProjectMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<ProjectMstQuery, ProjectMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ProjectMstQuery, ProjectMstQueryVariables>(ProjectMstDocument, options)
}
export type ProjectMstQueryHookResult = ReturnType<typeof useProjectMstQuery>
export type ProjectMstLazyQueryHookResult = ReturnType<typeof useProjectMstLazyQuery>
export type ProjectMstSuspenseQueryHookResult = ReturnType<typeof useProjectMstSuspenseQuery>
export type ProjectMstQueryResult = Apollo.QueryResult<ProjectMstQuery, ProjectMstQueryVariables>
