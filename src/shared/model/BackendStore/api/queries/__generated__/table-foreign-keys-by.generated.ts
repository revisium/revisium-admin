// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { PageInfoMstFragmentDoc } from '../../fragments/__generated__/page-info.generated'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type TableForeignKeysByQueryVariables = Types.Exact<{
  data: Types.GetTableInput
  foreignKeyData: Types.GetTableForeignKeysInput
}>

export type TableForeignKeysByQuery = {
  __typename?: 'Query'
  table?: {
    __typename?: 'TableModel'
    versionId: string
    foreignKeysBy: {
      __typename?: 'TablesConnection'
      totalCount: number
      pageInfo: {
        __typename?: 'PageInfo'
        startCursor?: string | null
        endCursor?: string | null
        hasPreviousPage: boolean
        hasNextPage: boolean
      }
      edges: Array<{
        __typename?: 'TableModelEdge'
        cursor: string
        node: {
          __typename?: 'TableModel'
          id: string
          versionId: string
          createdAt: string
          readonly: boolean
          count: number
          schema: { [key: string]: any } | string | number | boolean | null
        }
      }>
    }
  } | null
}

export const TableForeignKeysByDocument = gql`
  query TableForeignKeysBy($data: GetTableInput!, $foreignKeyData: GetTableForeignKeysInput!) {
    table(data: $data) {
      versionId
      foreignKeysBy(data: $foreignKeyData) {
        totalCount
        pageInfo {
          ...PageInfoMst
        }
        edges {
          cursor
          node {
            ...TableMst
          }
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${TableMstFragmentDoc}
`

/**
 * __useTableForeignKeysByQuery__
 *
 * To run a query within a React component, call `useTableForeignKeysByQuery` and pass it any options that fit your needs.
 * When your component renders, `useTableForeignKeysByQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTableForeignKeysByQuery({
 *   variables: {
 *      data: // value for 'data'
 *      foreignKeyData: // value for 'foreignKeyData'
 *   },
 * });
 */
export function useTableForeignKeysByQuery(
  baseOptions: Apollo.QueryHookOptions<TableForeignKeysByQuery, TableForeignKeysByQueryVariables> &
    ({ variables: TableForeignKeysByQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TableForeignKeysByQuery, TableForeignKeysByQueryVariables>(TableForeignKeysByDocument, options)
}
export function useTableForeignKeysByLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TableForeignKeysByQuery, TableForeignKeysByQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TableForeignKeysByQuery, TableForeignKeysByQueryVariables>(
    TableForeignKeysByDocument,
    options,
  )
}
export function useTableForeignKeysBySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<TableForeignKeysByQuery, TableForeignKeysByQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TableForeignKeysByQuery, TableForeignKeysByQueryVariables>(
    TableForeignKeysByDocument,
    options,
  )
}
export type TableForeignKeysByQueryHookResult = ReturnType<typeof useTableForeignKeysByQuery>
export type TableForeignKeysByLazyQueryHookResult = ReturnType<typeof useTableForeignKeysByLazyQuery>
export type TableForeignKeysBySuspenseQueryHookResult = ReturnType<typeof useTableForeignKeysBySuspenseQuery>
export type TableForeignKeysByQueryResult = Apollo.QueryResult<
  TableForeignKeysByQuery,
  TableForeignKeysByQueryVariables
>
