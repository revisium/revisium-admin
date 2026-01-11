import { EndpointType } from 'src/__generated__/graphql-request'
import { EndpointsDataSource } from '../api/EndpointsDataSource'
import { EndpointUrlBuilder, EndpointUrls } from '../lib/EndpointUrlBuilder'
import { EndpointCardData, EndpointCardViewModel } from './EndpointCardViewModel'

const createMockContext = () => ({
  organizationId: 'org1',
  projectName: 'project1',
})

const createMockProjectPermissions = (
  overrides: Partial<{ canCreateEndpoint: boolean; canDeleteEndpoint: boolean }> = {},
) => ({
  canCreateEndpoint: true,
  canDeleteEndpoint: true,
  ...overrides,
})

const createMockDataSource = () =>
  ({
    createEndpoint: jest.fn(),
    deleteEndpoint: jest.fn(),
  }) as unknown as EndpointsDataSource

const createMockUrls = (): EndpointUrls => ({
  graphql: 'https://example.com/graphql/test',
  openApi: 'https://example.com/openapi/test',
  sandbox: 'https://example.com/sandbox/test',
  swagger: undefined,
  copyable: 'https://example.com/graphql/test',
})

const createMockUrlBuilder = (urls: EndpointUrls = createMockUrls()) =>
  ({
    buildDraftHeadUrls: jest.fn(() => urls),
  }) as unknown as EndpointUrlBuilder

const createMockData = (overrides: Partial<EndpointCardData> = {}): EndpointCardData => ({
  branchId: 'branch-1',
  branchName: 'main',
  isRootBranch: true,
  revisionId: 'revision-1',
  revisionType: 'draft',
  endpointType: EndpointType.Graphql,
  endpointId: null,
  ...overrides,
})

describe('EndpointCardViewModel', () => {
  describe('computed properties', () => {
    it('should return correct revision label for draft', () => {
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        createMockDataSource(),
        createMockData({ revisionType: 'draft' }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.revisionLabel).toBe('Draft')
    })

    it('should return correct revision label for head', () => {
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        createMockDataSource(),
        createMockData({ revisionType: 'head' }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.revisionLabel).toBe('Head')
    })

    it('should return correct endpoint type label for GraphQL', () => {
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        createMockDataSource(),
        createMockData({ endpointType: EndpointType.Graphql }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.endpointTypeLabel).toBe('GraphQL')
    })

    it('should return correct endpoint type label for REST API', () => {
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        createMockDataSource(),
        createMockData({ endpointType: EndpointType.RestApi }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.endpointTypeLabel).toBe('REST API')
    })

    it('should return isEnabled false when endpointId is null', () => {
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        createMockDataSource(),
        createMockData({ endpointId: null }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.isEnabled).toBe(false)
    })

    it('should return isEnabled true when endpointId is set', () => {
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        createMockDataSource(),
        createMockData({ endpointId: 'endpoint-1' }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.isEnabled).toBe(true)
    })

    it('should return correct copy tooltip for GraphQL', () => {
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        createMockDataSource(),
        createMockData({ endpointType: EndpointType.Graphql }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.copyTooltip).toBe('Copy GraphQL URL')
    })

    it('should return correct copy tooltip for REST API', () => {
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        createMockDataSource(),
        createMockData({ endpointType: EndpointType.RestApi }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.copyTooltip).toBe('Copy OpenAPI URL')
    })
  })

  describe('permissions', () => {
    it('should reflect canCreate from permission context', () => {
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions({ canCreateEndpoint: false }) as never,
        createMockDataSource(),
        createMockData(),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.canCreate).toBe(false)
    })

    it('should reflect canDelete from permission context', () => {
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions({ canDeleteEndpoint: false }) as never,
        createMockDataSource(),
        createMockData(),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.canDelete).toBe(false)
    })
  })

  describe('URLs', () => {
    it('should return URLs from builder', () => {
      const urls = createMockUrls()
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        createMockDataSource(),
        createMockData(),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(urls), copyToClipboard: jest.fn() },
      )

      expect(vm.graphqlUrl).toBe(urls.graphql)
      expect(vm.openApiUrl).toBe(urls.openApi)
      expect(vm.sandboxUrl).toBe(urls.sandbox)
      expect(vm.swaggerUrl).toBe(urls.swagger)
      expect(vm.copyableUrl).toBe(urls.copyable)
    })
  })

  describe('copyUrl', () => {
    it('should call copyToClipboard with copyable URL', () => {
      const copyToClipboard = jest.fn().mockResolvedValue(undefined)
      const urls = createMockUrls()
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        createMockDataSource(),
        createMockData(),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(urls), copyToClipboard },
      )

      vm.copyUrl()

      expect(copyToClipboard).toHaveBeenCalledWith(urls.copyable)
    })
  })

  describe('enable', () => {
    it('should create endpoint and update state', async () => {
      const dataSource = createMockDataSource()
      const onChanged = jest.fn()
      ;(dataSource.createEndpoint as jest.Mock).mockResolvedValue({ id: 'new-endpoint-id' })

      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        dataSource,
        createMockData({ endpointId: null }),
        onChanged,
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.isEnabled).toBe(false)

      await vm.enable()

      expect(dataSource.createEndpoint).toHaveBeenCalledWith({
        revisionId: 'revision-1',
        type: EndpointType.Graphql,
      })
      expect(vm.isEnabled).toBe(true)
      expect(onChanged).toHaveBeenCalled()
    })

    it('should not create endpoint if already enabled', async () => {
      const dataSource = createMockDataSource()
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        dataSource,
        createMockData({ endpointId: 'existing-endpoint' }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      await vm.enable()

      expect(dataSource.createEndpoint).not.toHaveBeenCalled()
    })

    it('should not create endpoint if already creating', async () => {
      const dataSource = createMockDataSource()
      let resolveCreate: (value: unknown) => void
      ;(dataSource.createEndpoint as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveCreate = resolve
        }),
      )

      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        dataSource,
        createMockData({ endpointId: null }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      const firstCall = vm.enable()
      expect(vm.isCreating).toBe(true)

      await vm.enable()

      expect(dataSource.createEndpoint).toHaveBeenCalledTimes(1)

      resolveCreate!({ id: 'new-id' })
      await firstCall
    })

    it('should set isCreating during creation', async () => {
      const dataSource = createMockDataSource()
      let resolveCreate: (value: unknown) => void
      ;(dataSource.createEndpoint as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveCreate = resolve
        }),
      )

      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        dataSource,
        createMockData({ endpointId: null }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.isCreating).toBe(false)
      expect(vm.isLoading).toBe(false)

      const promise = vm.enable()

      expect(vm.isCreating).toBe(true)
      expect(vm.isLoading).toBe(true)

      resolveCreate!({ id: 'new-id' })
      await promise

      expect(vm.isCreating).toBe(false)
      expect(vm.isLoading).toBe(false)
    })
  })

  describe('disable', () => {
    it('should delete endpoint and update state', async () => {
      const dataSource = createMockDataSource()
      const onChanged = jest.fn()
      ;(dataSource.deleteEndpoint as jest.Mock).mockResolvedValue(true)

      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        dataSource,
        createMockData({ endpointId: 'endpoint-to-delete' }),
        onChanged,
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      expect(vm.isEnabled).toBe(true)

      await vm.disable()

      expect(dataSource.deleteEndpoint).toHaveBeenCalledWith('endpoint-to-delete')
      expect(vm.isEnabled).toBe(false)
      expect(onChanged).toHaveBeenCalled()
    })

    it('should not delete if not enabled', async () => {
      const dataSource = createMockDataSource()
      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        dataSource,
        createMockData({ endpointId: null }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      await vm.disable()

      expect(dataSource.deleteEndpoint).not.toHaveBeenCalled()
    })

    it('should not call onChanged if delete fails', async () => {
      const dataSource = createMockDataSource()
      const onChanged = jest.fn()
      ;(dataSource.deleteEndpoint as jest.Mock).mockResolvedValue(false)

      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        dataSource,
        createMockData({ endpointId: 'endpoint-to-delete' }),
        onChanged,
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      await vm.disable()

      expect(vm.isEnabled).toBe(true)
      expect(onChanged).not.toHaveBeenCalled()
    })
  })

  describe('toggle', () => {
    it('should enable when disabled', async () => {
      const dataSource = createMockDataSource()
      ;(dataSource.createEndpoint as jest.Mock).mockResolvedValue({ id: 'new-id' })

      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        dataSource,
        createMockData({ endpointId: null }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      await vm.toggle()

      expect(dataSource.createEndpoint).toHaveBeenCalled()
      expect(dataSource.deleteEndpoint).not.toHaveBeenCalled()
    })

    it('should disable when enabled', async () => {
      const dataSource = createMockDataSource()
      ;(dataSource.deleteEndpoint as jest.Mock).mockResolvedValue(true)

      const vm = new EndpointCardViewModel(
        createMockContext() as never,
        createMockProjectPermissions() as never,
        dataSource,
        createMockData({ endpointId: 'existing-endpoint' }),
        jest.fn(),
        { urlBuilder: createMockUrlBuilder(), copyToClipboard: jest.fn() },
      )

      await vm.toggle()

      expect(dataSource.deleteEndpoint).toHaveBeenCalled()
      expect(dataSource.createEndpoint).not.toHaveBeenCalled()
    })
  })
})
