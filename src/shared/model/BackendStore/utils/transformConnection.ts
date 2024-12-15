import { PageInfoFragment } from 'src/entities/PageInfo'
import { IPageInfoModel } from 'src/shared/model/BackendStore'

const transformPageInfo = (pageInfo: PageInfoFragment): IPageInfoModel => ({
  startCursor: pageInfo.endCursor || null,
  endCursor: pageInfo.endCursor || null,
  hasPreviousPage: pageInfo.hasPreviousPage,
  hasNextPage: pageInfo.hasNextPage,
})

export const transformConnectionId = (connection: {
  totalCount: number
  pageInfo: PageInfoFragment
  edges: { cursor: string; node: { id: string } }[]
}) => {
  return {
    totalCount: connection.totalCount,
    pageInfo: transformPageInfo(connection.pageInfo),
    edges: connection.edges.map(({ cursor, node }) => ({
      cursor,
      node: node.id,
    })),
  }
}

export const transformConnectionVersionId = (connection: {
  totalCount: number
  pageInfo: PageInfoFragment
  edges: { cursor: string; node: { versionId: string } }[]
}) => {
  return {
    totalCount: connection.totalCount,
    pageInfo: transformPageInfo(connection.pageInfo),
    edges: connection.edges.map(({ cursor, node }) => ({
      cursor,
      node: node.versionId,
    })),
  }
}
