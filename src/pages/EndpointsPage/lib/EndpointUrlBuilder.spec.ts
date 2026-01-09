import { EndpointType } from 'src/__generated__/graphql-request'
import { EndpointUrlBuilder } from './EndpointUrlBuilder'

describe('EndpointUrlBuilder', () => {
  const origin = 'https://example.com'
  const endpointServerUrl = '/endpoint'

  const createBuilder = () => new EndpointUrlBuilder(origin, endpointServerUrl)

  describe('buildUrls', () => {
    it('should build GraphQL URLs correctly', () => {
      const builder = createBuilder()
      const urls = builder.buildUrls({
        organizationId: 'org1',
        projectName: 'project1',
        branchName: 'master',
        revisionTag: 'draft',
        endpointType: EndpointType.Graphql,
      })

      expect(urls.graphql).toBe('https://example.com/endpoint/graphql/org1/project1/master/draft')
      expect(urls.openApi).toBe('https://example.com/endpoint/openapi/org1/project1/master/draft/openapi.json')
      expect(urls.sandbox).toBe('https://example.com/sandbox/org1/project1/master/draft')
      expect(urls.swagger).toBeUndefined()
      expect(urls.copyable).toBe('https://example.com/endpoint/graphql/org1/project1/master/draft')
    })

    it('should build REST API URLs correctly', () => {
      const builder = createBuilder()
      const urls = builder.buildUrls({
        organizationId: 'org1',
        projectName: 'project1',
        branchName: 'master',
        revisionTag: 'head',
        endpointType: EndpointType.RestApi,
      })

      expect(urls.graphql).toBe('https://example.com/endpoint/graphql/org1/project1/master/head')
      expect(urls.openApi).toBe('https://example.com/endpoint/openapi/org1/project1/master/head/openapi.json')
      expect(urls.sandbox).toBeUndefined()
      expect(urls.swagger).toBe('https://example.com/endpoint/swagger/org1/project1/master/head')
      expect(urls.copyable).toBe('https://example.com/endpoint/openapi/org1/project1/master/head/openapi.json')
    })
  })

  describe('buildDraftHeadUrls', () => {
    it('should build draft URLs with draft tag', () => {
      const builder = createBuilder()
      const urls = builder.buildDraftHeadUrls('org1', 'project1', 'master', 'draft', EndpointType.Graphql)

      expect(urls.graphql).toContain('/draft')
      expect(urls.graphql).toBe('https://example.com/endpoint/graphql/org1/project1/master/draft')
    })

    it('should build head URLs with head tag', () => {
      const builder = createBuilder()
      const urls = builder.buildDraftHeadUrls('org1', 'project1', 'master', 'head', EndpointType.Graphql)

      expect(urls.graphql).toContain('/head')
      expect(urls.graphql).toBe('https://example.com/endpoint/graphql/org1/project1/master/head')
    })
  })

  describe('buildCustomRevisionUrls', () => {
    it('should use first 8 characters of revision ID', () => {
      const builder = createBuilder()
      const urls = builder.buildCustomRevisionUrls(
        'org1',
        'project1',
        'master',
        'abcdefgh12345678',
        EndpointType.Graphql,
      )

      expect(urls.graphql).toContain('/abcdefgh')
      expect(urls.graphql).not.toContain('12345678')
    })
  })
})
