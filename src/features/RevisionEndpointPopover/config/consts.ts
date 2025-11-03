import { EndpointType } from 'src/__generated__/graphql-request.ts'

export const getLabelByEndpointType = (type: EndpointType): string => {
  switch (type) {
    case EndpointType.Graphql:
      return 'GraphQL'
    case EndpointType.RestApi:
      return 'REST API'
    default:
      return 'Unknown'
  }
}
