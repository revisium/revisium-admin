// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { RevisionMstFragmentDoc } from '../../fragments/__generated__/revision.generated'
import { BranchMstFragmentDoc } from '../../fragments/__generated__/branch.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type CreateRevisionMstMutationVariables = Types.Exact<{
  data: Types.CreateRevisionInput
}>

export type CreateRevisionMstMutation = {
  __typename?: 'Mutation'
  createRevision: {
    __typename?: 'RevisionModel'
    id: string
    createdAt: string
    comment: string
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
    parent?: { __typename?: 'RevisionModel'; id: string } | null
    child?: { __typename?: 'RevisionModel'; id: string } | null
    childBranches: Array<{
      __typename?: 'ChildBranchModel'
      branch: { __typename?: 'BranchModel'; id: string; name: string }
      revision: { __typename?: 'RevisionModel'; id: string }
    }>
    endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
  }
}

export const CreateRevisionMstDocument = gql`
  mutation CreateRevisionMst($data: CreateRevisionInput!) {
    createRevision(data: $data) {
      ...RevisionMst
      branch {
        ...BranchMst
      }
    }
  }
  ${RevisionMstFragmentDoc}
  ${BranchMstFragmentDoc}
`
export type CreateRevisionMstMutationFn = Apollo.MutationFunction<
  CreateRevisionMstMutation,
  CreateRevisionMstMutationVariables
>

/**
 * __useCreateRevisionMstMutation__
 *
 * To run a mutation, you first call `useCreateRevisionMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRevisionMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRevisionMstMutation, { data, loading, error }] = useCreateRevisionMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateRevisionMstMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateRevisionMstMutation, CreateRevisionMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateRevisionMstMutation, CreateRevisionMstMutationVariables>(
    CreateRevisionMstDocument,
    options,
  )
}
export type CreateRevisionMstMutationHookResult = ReturnType<typeof useCreateRevisionMstMutation>
export type CreateRevisionMstMutationResult = Apollo.MutationResult<CreateRevisionMstMutation>
export type CreateRevisionMstMutationOptions = Apollo.BaseMutationOptions<
  CreateRevisionMstMutation,
  CreateRevisionMstMutationVariables
>
