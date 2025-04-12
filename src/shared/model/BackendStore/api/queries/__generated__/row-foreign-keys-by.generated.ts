// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { PageInfoMstFragmentDoc } from '../../fragments/__generated__/page-info.generated'
import { RowMstFragmentDoc } from '../../fragments/__generated__/row.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type RowForeignKeysByQueryVariables = Types.Exact<{
  data: Types.GetRowInput
  foreignKeyData: Types.GetRowForeignKeysInput
}>

export type RowForeignKeysByQuery = {
  __typename?: 'Query'
  row?: {
    __typename?: 'RowModel'
    versionId: string
    rowForeignKeysBy: {
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
          createdId: string
          id: string
          versionId: string
          createdAt: string
          updatedAt: string
          readonly: boolean
          data: { [key: string]: any } | string | number | boolean | null
        }
      }>
    }
  } | null
}

export const RowForeignKeysByDocument = gql`
  query RowForeignKeysBy($data: GetRowInput!, $foreignKeyData: GetRowForeignKeysInput!) {
    row(data: $data) {
      versionId
      rowForeignKeysBy(data: $foreignKeyData) {
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
 * __useRowForeignKeysByQuery__
 *
 * To run a query within a React component, call `useRowForeignKeysByQuery` and pass it any options that fit your needs.
 * When your component renders, `useRowForeignKeysByQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRowForeignKeysByQuery({
 *   variables: {
 *      data: // value for 'data'
 *      foreignKeyData: // value for 'foreignKeyData'
 *   },
 * });
 */
export function useRowForeignKeysByQuery(
  baseOptions: Apollo.QueryHookOptions<RowForeignKeysByQuery, RowForeignKeysByQueryVariables> &
    ({ variables: RowForeignKeysByQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RowForeignKeysByQuery, RowForeignKeysByQueryVariables>(RowForeignKeysByDocument, options)
}
export function useRowForeignKeysByLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RowForeignKeysByQuery, RowForeignKeysByQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RowForeignKeysByQuery, RowForeignKeysByQueryVariables>(RowForeignKeysByDocument, options)
}
export function useRowForeignKeysBySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<RowForeignKeysByQuery, RowForeignKeysByQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RowForeignKeysByQuery, RowForeignKeysByQueryVariables>(
    RowForeignKeysByDocument,
    options,
  )
}
export type RowForeignKeysByQueryHookResult = ReturnType<typeof useRowForeignKeysByQuery>
export type RowForeignKeysByLazyQueryHookResult = ReturnType<typeof useRowForeignKeysByLazyQuery>
export type RowForeignKeysBySuspenseQueryHookResult = ReturnType<typeof useRowForeignKeysBySuspenseQuery>
export type RowForeignKeysByQueryResult = Apollo.QueryResult<RowForeignKeysByQuery, RowForeignKeysByQueryVariables>
