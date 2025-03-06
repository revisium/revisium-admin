// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { PageInfoMstFragmentDoc } from '../../fragments/__generated__/page-info.generated'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type TableReferencesByQueryVariables = Types.Exact<{
  data: Types.GetTableInput
  referenceData: Types.GetTableForeignKeysInput
}>

export type TableReferencesByQuery = {
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

export const TableReferencesByDocument = gql`
  query TableReferencesBy($data: GetTableInput!, $referenceData: GetTableForeignKeysInput!) {
    table(data: $data) {
      versionId
      foreignKeysBy(data: $referenceData) {
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
 * __useTableReferencesByQuery__
 *
 * To run a query within a React component, call `useTableReferencesByQuery` and pass it any options that fit your needs.
 * When your component renders, `useTableReferencesByQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTableReferencesByQuery({
 *   variables: {
 *      data: // value for 'data'
 *      referenceData: // value for 'referenceData'
 *   },
 * });
 */
export function useTableReferencesByQuery(
  baseOptions: Apollo.QueryHookOptions<TableReferencesByQuery, TableReferencesByQueryVariables> &
    ({ variables: TableReferencesByQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TableReferencesByQuery, TableReferencesByQueryVariables>(TableReferencesByDocument, options)
}
export function useTableReferencesByLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TableReferencesByQuery, TableReferencesByQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TableReferencesByQuery, TableReferencesByQueryVariables>(
    TableReferencesByDocument,
    options,
  )
}
export function useTableReferencesBySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<TableReferencesByQuery, TableReferencesByQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TableReferencesByQuery, TableReferencesByQueryVariables>(
    TableReferencesByDocument,
    options,
  )
}
export type TableReferencesByQueryHookResult = ReturnType<typeof useTableReferencesByQuery>
export type TableReferencesByLazyQueryHookResult = ReturnType<typeof useTableReferencesByLazyQuery>
export type TableReferencesBySuspenseQueryHookResult = ReturnType<typeof useTableReferencesBySuspenseQuery>
export type TableReferencesByQueryResult = Apollo.QueryResult<TableReferencesByQuery, TableReferencesByQueryVariables>
