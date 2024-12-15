// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type DeleteProjectMstMutationVariables = Types.Exact<{
  data: Types.DeleteProjectInput
}>

export type DeleteProjectMstMutation = { __typename?: 'Mutation'; deleteProject: boolean }

export const DeleteProjectMstDocument = gql`
  mutation DeleteProjectMst($data: DeleteProjectInput!) {
    deleteProject(data: $data)
  }
`
export type DeleteProjectMstMutationFn = Apollo.MutationFunction<
  DeleteProjectMstMutation,
  DeleteProjectMstMutationVariables
>

/**
 * __useDeleteProjectMstMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMstMutation, { data, loading, error }] = useDeleteProjectMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteProjectMstMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteProjectMstMutation, DeleteProjectMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteProjectMstMutation, DeleteProjectMstMutationVariables>(
    DeleteProjectMstDocument,
    options,
  )
}
export type DeleteProjectMstMutationHookResult = ReturnType<typeof useDeleteProjectMstMutation>
export type DeleteProjectMstMutationResult = Apollo.MutationResult<DeleteProjectMstMutation>
export type DeleteProjectMstMutationOptions = Apollo.BaseMutationOptions<
  DeleteProjectMstMutation,
  DeleteProjectMstMutationVariables
>
