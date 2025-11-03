import { EndpointType } from 'src/__generated__/graphql-request.ts'

export type EndpointFragment = {
  id: string
  type: EndpointType
}

export type RevisionFragment = {
  id: string
  comment: string
  isDraft: boolean
  isHead: boolean
  isStart: boolean
  createdAt: string
  endpoints: EndpointFragment[]
}
