import { DRAFT_TAG, HEAD_TAG, SANDBOX_ROUTE } from 'src/shared/config/routes.ts'
import { getEnv } from 'src/shared/env/getEnv.ts'
import { getOrigin } from 'src/shared/lib'
import { EndpointType } from 'src/__generated__/graphql-request'

export interface EndpointUrls {
  graphql: string
  openApi: string
  sandbox: string | undefined
  swagger: string | undefined
  copyable: string
}

export interface EndpointUrlParams {
  organizationId: string
  projectName: string
  branchName: string
  revisionTag: string
  endpointType: EndpointType
}

export class EndpointUrlBuilder {
  private readonly endpointServerUrl: string
  private readonly origin: string

  constructor(origin?: string, endpointServerUrl?: string) {
    this.origin = origin ?? getOrigin()
    this.endpointServerUrl = endpointServerUrl ?? getEnv('REACT_APP_ENDPOINT_SERVER_URL')
  }

  public buildUrls(params: EndpointUrlParams): EndpointUrls {
    const pathSegment = this.buildPathSegment(params)
    const baseUrl = `${this.origin}${this.endpointServerUrl}`

    const graphqlUrl = `${baseUrl}/graphql/${pathSegment}`
    const openApiUrl = `${baseUrl}/openapi/${pathSegment}/openapi.json`

    return {
      graphql: graphqlUrl,
      openApi: openApiUrl,
      sandbox:
        params.endpointType === EndpointType.Graphql ? `${this.origin}/${SANDBOX_ROUTE}/${pathSegment}` : undefined,
      swagger: params.endpointType === EndpointType.RestApi ? `${baseUrl}/swagger/${pathSegment}` : undefined,
      copyable: params.endpointType === EndpointType.Graphql ? graphqlUrl : openApiUrl,
    }
  }

  public buildDraftHeadUrls(
    organizationId: string,
    projectName: string,
    branchName: string,
    revisionType: 'draft' | 'head',
    endpointType: EndpointType,
  ): EndpointUrls {
    const revisionTag = revisionType === 'draft' ? DRAFT_TAG : HEAD_TAG
    return this.buildUrls({
      organizationId,
      projectName,
      branchName,
      revisionTag,
      endpointType,
    })
  }

  public buildCustomRevisionUrls(
    organizationId: string,
    projectName: string,
    branchName: string,
    revisionId: string,
    endpointType: EndpointType,
  ): EndpointUrls {
    return this.buildUrls({
      organizationId,
      projectName,
      branchName,
      revisionTag: revisionId.substring(0, 8),
      endpointType,
    })
  }

  private buildPathSegment(params: EndpointUrlParams): string {
    return `${params.organizationId}/${params.projectName}/${params.branchName}/${params.revisionTag}`
  }
}
