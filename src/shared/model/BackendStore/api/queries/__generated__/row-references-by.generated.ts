// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { PageInfoMstFragmentDoc } from '../../fragments/__generated__/page-info.generated'
import { RowMstFragmentDoc } from '../../fragments/__generated__/row.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type RowReferencesByQueryVariables = Types.Exact<{
  data: Types.GetRowInput
  referenceData: Types.GetRowReferencesInput
}>

export type RowReferencesByQuery = {
  __typename?: 'Query'
  row?: {
    __typename?: 'RowModel'
    versionId: string
    rowReferencesBy: {
      __typename?: 'RowsConnection'
      totalCount: number
      pageInfo: {
        __typename?: 'PageInfo'
        startCursor?: string | null
        endCursor?: string | null
        hasPreviousPage: boolean
        hasNextPage: boolean
      }
      edges: Array<{
        __typename?: 'RowModelEdge'
        cursor: string
        node: {
          __typename?: 'RowModel'
          id: string
          versionId: string
          createdAt: string
          readonly: boolean
          data: { [key: string]: any } | string | number | boolean | null
        }
      }>
    }
  } | null
}

export const RowReferencesByDocument = gql`
  query RowReferencesBy($data: GetRowInput!, $referenceData: GetRowReferencesInput!) {
    row(data: $data) {
      versionId
      rowReferencesBy(data: $referenceData) {
        totalCount
        pageInfo {
          ...PageInfoMst
        }
        edges {
          cursor
          node {
            ...RowMst
          }
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${RowMstFragmentDoc}
`

/**
 * __useRowReferencesByQuery__
 *
 * To run a query within a React component, call `useRowReferencesByQuery` and pass it any options that fit your needs.
 * When your component renders, `useRowReferencesByQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRowReferencesByQuery({
 *   variables: {
 *      data: // value for 'data'
 *      referenceData: // value for 'referenceData'
 *   },
 * });
 */
export function useRowReferencesByQuery(
  baseOptions: Apollo.QueryHookOptions<RowReferencesByQuery, RowReferencesByQueryVariables> &
    ({ variables: RowReferencesByQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RowReferencesByQuery, RowReferencesByQueryVariables>(RowReferencesByDocument, options)
}
export function useRowReferencesByLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RowReferencesByQuery, RowReferencesByQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RowReferencesByQuery, RowReferencesByQueryVariables>(RowReferencesByDocument, options)
}
export function useRowReferencesBySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<RowReferencesByQuery, RowReferencesByQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RowReferencesByQuery, RowReferencesByQueryVariables>(RowReferencesByDocument, options)
}
export type RowReferencesByQueryHookResult = ReturnType<typeof useRowReferencesByQuery>
export type RowReferencesByLazyQueryHookResult = ReturnType<typeof useRowReferencesByLazyQuery>
export type RowReferencesBySuspenseQueryHookResult = ReturnType<typeof useRowReferencesBySuspenseQuery>
export type RowReferencesByQueryResult = Apollo.QueryResult<RowReferencesByQuery, RowReferencesByQueryVariables>
