// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { ProjectMstFragmentDoc } from '../../fragments/__generated__/project.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type CreateProjectMstMutationVariables = Types.Exact<{
  data: Types.CreateProjectInput
}>

export type CreateProjectMstMutation = {
  __typename?: 'Mutation'
  createProject: {
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

export const CreateProjectMstDocument = gql`
  mutation CreateProjectMst($data: CreateProjectInput!) {
    createProject(data: $data) {
      ...ProjectMst
    }
  }
  ${ProjectMstFragmentDoc}
`
export type CreateProjectMstMutationFn = Apollo.MutationFunction<
  CreateProjectMstMutation,
  CreateProjectMstMutationVariables
>

/**
 * __useCreateProjectMstMutation__
 *
 * To run a mutation, you first call `useCreateProjectMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMstMutation, { data, loading, error }] = useCreateProjectMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateProjectMstMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateProjectMstMutation, CreateProjectMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateProjectMstMutation, CreateProjectMstMutationVariables>(
    CreateProjectMstDocument,
    options,
  )
}
export type CreateProjectMstMutationHookResult = ReturnType<typeof useCreateProjectMstMutation>
export type CreateProjectMstMutationResult = Apollo.MutationResult<CreateProjectMstMutation>
export type CreateProjectMstMutationOptions = Apollo.BaseMutationOptions<
  CreateProjectMstMutation,
  CreateProjectMstMutationVariables
>
