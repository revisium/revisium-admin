import { EndpointType } from 'src/__generated__/globalTypes.ts'

const mapper: Record<EndpointType, string> = {
  [EndpointType.GRAPHQL]: 'GraphQL',
  [EndpointType.REST_API]: 'Swagger',
}

export const getLabelByEndpointType = (type: EndpointType): string => {
  return mapper[type]
}
