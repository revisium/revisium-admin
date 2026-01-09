import { EndpointType } from 'src/__generated__/graphql-request'
import { EndpointUrlBuilder, EndpointUrls } from '../lib/EndpointUrlBuilder'
import { CustomEndpointCardViewModel } from './CustomEndpointCardViewModel'

const createMockEndpoint = (overrides: Partial<{ type: EndpointType; revisionId: string; id: string }> = {}) => ({
  id: 'endpoint-1',
  type: EndpointType.Graphql,
  revisionId: 'abcdefgh12345678',
  createdAt: '2024-01-01',
  revision: {
    id: 'revision-1',
    isDraft: false,
    isHead: false,
    createdAt: '2024-01-01',
    branch: {
      id: 'branch-1',
      name: 'main',
    },
  },
  ...overrides,
})

const createMockUrls = (overrides: Partial<EndpointUrls> = {}): EndpointUrls => ({
  graphql: 'https://example.com/graphql/test',
  openApi: 'https://example.com/openapi/test',
  sandbox: 'https://example.com/sandbox/test',
  swagger: undefined,
  copyable: 'https://example.com/graphql/test',
  ...overrides,
})

const createMockUrlBuilder = (urls: EndpointUrls = createMockUrls()) =>
  ({
    buildCustomRevisionUrls: jest.fn(() => urls),
  }) as unknown as EndpointUrlBuilder

describe('CustomEndpointCardViewModel', () => {
  describe('computed properties', () => {
    it('should return endpoint id', () => {
      const endpoint = createMockEndpoint({ id: 'my-endpoint-id' })
      const vm = new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder: createMockUrlBuilder(),
        copyToClipboard: jest.fn(),
      })

      expect(vm.id).toBe('my-endpoint-id')
    })

    it('should return branch name from revision', () => {
      const endpoint = createMockEndpoint()
      const vm = new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder: createMockUrlBuilder(),
        copyToClipboard: jest.fn(),
      })

      expect(vm.branchName).toBe('main')
    })

    it('should return revision id', () => {
      const endpoint = createMockEndpoint({ revisionId: 'test-revision-123' })
      const vm = new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder: createMockUrlBuilder(),
        copyToClipboard: jest.fn(),
      })

      expect(vm.revisionId).toBe('test-revision-123')
    })

    it('should return formatted revision label', () => {
      const endpoint = createMockEndpoint({ revisionId: 'abcdefgh12345678' })
      const vm = new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder: createMockUrlBuilder(),
        copyToClipboard: jest.fn(),
      })

      expect(vm.revisionLabel).toBe('main / abcdefgh')
    })

    it('should return isGraphql true for GraphQL type', () => {
      const endpoint = createMockEndpoint({ type: EndpointType.Graphql })
      const vm = new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder: createMockUrlBuilder(),
        copyToClipboard: jest.fn(),
      })

      expect(vm.isGraphql).toBe(true)
    })

    it('should return isGraphql false for REST API type', () => {
      const endpoint = createMockEndpoint({ type: EndpointType.RestApi })
      const vm = new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder: createMockUrlBuilder(),
        copyToClipboard: jest.fn(),
      })

      expect(vm.isGraphql).toBe(false)
    })

    it('should return correct copy tooltip for GraphQL', () => {
      const endpoint = createMockEndpoint({ type: EndpointType.Graphql })
      const vm = new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder: createMockUrlBuilder(),
        copyToClipboard: jest.fn(),
      })

      expect(vm.copyTooltip).toBe('Copy GraphQL URL')
    })

    it('should return correct copy tooltip for REST API', () => {
      const endpoint = createMockEndpoint({ type: EndpointType.RestApi })
      const vm = new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder: createMockUrlBuilder(),
        copyToClipboard: jest.fn(),
      })

      expect(vm.copyTooltip).toBe('Copy OpenAPI URL')
    })
  })

  describe('URLs', () => {
    it('should return URLs from builder', () => {
      const urls = createMockUrls()
      const endpoint = createMockEndpoint()
      const vm = new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder: createMockUrlBuilder(urls),
        copyToClipboard: jest.fn(),
      })

      expect(vm.copyableUrl).toBe(urls.copyable)
      expect(vm.sandboxUrl).toBe(urls.sandbox)
      expect(vm.swaggerUrl).toBe(urls.swagger)
    })

    it('should call url builder with correct params', () => {
      const urlBuilder = createMockUrlBuilder()
      const endpoint = createMockEndpoint({ revisionId: 'rev123' })

      new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder,
        copyToClipboard: jest.fn(),
      })

      expect(urlBuilder.buildCustomRevisionUrls).toHaveBeenCalledWith(
        'org1',
        'project1',
        'main',
        'rev123',
        EndpointType.Graphql,
      )
    })
  })

  describe('copyUrl', () => {
    it('should call copyToClipboard with copyable URL', () => {
      const copyToClipboard = jest.fn().mockResolvedValue(undefined)
      const urls = createMockUrls({ copyable: 'https://copy-this-url.com' })
      const endpoint = createMockEndpoint()

      const vm = new CustomEndpointCardViewModel(endpoint as never, 'org1', 'project1', {
        urlBuilder: createMockUrlBuilder(urls),
        copyToClipboard,
      })

      vm.copyUrl()

      expect(copyToClipboard).toHaveBeenCalledWith('https://copy-this-url.com')
    })
  })
})
