import { Router, RouterState, AgnosticDataRouteMatch } from '@remix-run/router'
import { makeAutoObservable } from 'mobx'
import { RouteIds } from 'src/shared/config/routes.ts'
import { RouterService } from '../RouterService'
import { RouterParams } from '../RouterParams'
import { BootstrapService } from '../BootstrapService'

jest.mock('react-router-dom', () => ({
  createBrowserRouter: jest.fn(),
  matchRoutes: jest.fn(),
}))

jest.mock('src/app/config/rootRoutes.tsx', () => ({
  ROOT_ROUTES: [],
}))

const { createBrowserRouter, matchRoutes } = jest.requireMock('react-router-dom')

const createLocation = (pathname = '/', overrides: Partial<RouterState['location']> = {}): RouterState['location'] => ({
  pathname,
  search: '',
  hash: '',
  state: null,
  key: 'default',
  ...overrides,
})

const createMockRouterState = (
  overrides: Partial<RouterState> & { matches?: AgnosticDataRouteMatch[] } = {},
): RouterState =>
  ({
    historyAction: 'POP',
    location: createLocation(),
    matches: [],
    initialized: true,
    navigation: { state: 'idle', location: undefined },
    restoreScrollPosition: null,
    preventScrollReset: false,
    revalidation: 'idle',
    loaderData: {},
    actionData: null,
    errors: null,
    fetchers: new Map(),
    blockers: new Map(),
    ...overrides,
  }) as RouterState

const createNavigatingState = (pathname: string, matches: AgnosticDataRouteMatch[] = []): Partial<RouterState> => ({
  matches,
  navigation: {
    state: 'loading',
    location: createLocation(pathname),
    formMethod: undefined,
    formAction: undefined,
    formEncType: undefined,
    formData: undefined,
    json: undefined,
    text: undefined,
  },
})

const createMockMatch = (params: Record<string, string>, routeId?: string): AgnosticDataRouteMatch =>
  ({
    params,
    pathname: '/',
    pathnameBase: '/',
    route: { id: routeId, path: '/' },
  }) as AgnosticDataRouteMatch

class MockBootstrapService {
  public isLoaded = false

  constructor() {
    makeAutoObservable(this)
  }

  public setLoaded(): void {
    this.isLoaded = true
  }
}

type SubscribeCallback = (state: RouterState) => void

const createRouterService = (bootstrapService: MockBootstrapService): RouterService => {
  const params = new RouterParams()
  return new RouterService(bootstrapService as unknown as BootstrapService, params)
}

describe('RouterService', () => {
  let mockRouter: Partial<Router>
  let mockSubscribeCallback: SubscribeCallback | null
  let bootstrapService: MockBootstrapService

  beforeEach(() => {
    jest.clearAllMocks()
    mockSubscribeCallback = null

    mockRouter = {
      state: createMockRouterState(),
      subscribe: jest.fn((callback: SubscribeCallback) => {
        mockSubscribeCallback = callback
        return jest.fn()
      }),
      navigate: jest.fn().mockResolvedValue(undefined),
    }

    createBrowserRouter.mockReturnValue(mockRouter)
    matchRoutes.mockReturnValue(null)

    bootstrapService = new MockBootstrapService()
  })

  describe('initialization', () => {
    it('should not create router until bootstrap is loaded', () => {
      createRouterService(bootstrapService)

      expect(createBrowserRouter).not.toHaveBeenCalled()
    })

    it('should create router when bootstrap is loaded', () => {
      const service = createRouterService(bootstrapService)

      bootstrapService.setLoaded()

      expect(createBrowserRouter).toHaveBeenCalled()
      expect(service.isRouterReady).toBe(true)
    })

    it('should initialize params from initial router state', () => {
      ;(mockRouter as { state: RouterState }).state = createMockRouterState({
        matches: [
          createMockMatch({ organizationId: 'org-1', projectName: 'project-1' }),
          createMockMatch({ branchName: 'main' }),
        ],
      })

      const service = createRouterService(bootstrapService)
      bootstrapService.setLoaded()

      expect(service.params.organizationId).toBe('org-1')
      expect(service.params.projectName).toBe('project-1')
      expect(service.params.branchName).toBe('main')
    })
  })

  describe('router state updates', () => {
    let service: RouterService

    beforeEach(() => {
      service = createRouterService(bootstrapService)
      bootstrapService.setLoaded()
    })

    it('should update params when router state changes', () => {
      expect(mockSubscribeCallback).not.toBeNull()

      mockSubscribeCallback!(
        createMockRouterState({
          matches: [createMockMatch({ organizationId: 'new-org', projectName: 'new-project' })],
        }),
      )

      expect(service.params.organizationId).toBe('new-org')
      expect(service.params.projectName).toBe('new-project')
    })

    it('should update location when router state changes', () => {
      mockSubscribeCallback!(
        createMockRouterState({
          location: createLocation('/org/project/tables', {
            search: '?filter=active',
            hash: '#section',
          }),
        }),
      )

      expect(service.pathname).toBe('/org/project/tables')
      expect(service.search).toBe('?filter=active')
      expect(service.hash).toBe('#section')
    })

    it('should update navigation state', () => {
      mockSubscribeCallback!(createMockRouterState(createNavigatingState('/new-path')))

      expect(service.navigationState).toBe('loading')
      expect(service.isNavigating).toBe(true)
      expect(service.isLoading).toBe(true)
    })

    it('should update matched route ids', () => {
      mockSubscribeCallback!(
        createMockRouterState({
          matches: [createMockMatch({}, RouteIds.Project), createMockMatch({}, RouteIds.Table)],
        }),
      )

      expect(service.matchedRouteIds.has(RouteIds.Project)).toBe(true)
      expect(service.matchedRouteIds.has(RouteIds.Table)).toBe(true)
      expect(service.isInProject).toBe(true)
      expect(service.isInTable).toBe(true)
      expect(service.isInRow).toBe(false)
    })
  })

  describe('params during navigation', () => {
    let service: RouterService

    beforeEach(() => {
      service = createRouterService(bootstrapService)
      bootstrapService.setLoaded()
    })

    it('should extract params from navigation.location when navigating', () => {
      const targetMatches = [createMockMatch({ organizationId: 'target-org', projectName: 'target-project' })]
      matchRoutes.mockReturnValue(targetMatches)

      const oldMatches = [createMockMatch({ organizationId: 'old-org', projectName: 'old-project' })]
      mockSubscribeCallback!(createMockRouterState(createNavigatingState('/target-org/target-project', oldMatches)))

      expect(service.params.organizationId).toBe('target-org')
      expect(service.params.projectName).toBe('target-project')
    })

    it('should use state.matches params when navigation is idle', () => {
      mockSubscribeCallback!(
        createMockRouterState({
          matches: [createMockMatch({ organizationId: 'current-org' })],
        }),
      )

      expect(matchRoutes).not.toHaveBeenCalled()
      expect(service.params.organizationId).toBe('current-org')
    })

    it('should fallback to state.matches if matchRoutes returns null', () => {
      matchRoutes.mockReturnValue(null)

      const fallbackMatches = [createMockMatch({ organizationId: 'fallback-org' })]
      mockSubscribeCallback!(createMockRouterState(createNavigatingState('/some-path', fallbackMatches)))

      expect(service.params.organizationId).toBe('fallback-org')
    })
  })

  describe('computed properties', () => {
    let service: RouterService

    beforeEach(() => {
      service = createRouterService(bootstrapService)
      bootstrapService.setLoaded()
    })

    it.each([
      ['loading', true],
      ['submitting', true],
      ['idle', false],
    ] as const)('isNavigating should return %s when state is %s', (state, expected) => {
      mockSubscribeCallback!(createMockRouterState({ navigation: { state } } as Partial<RouterState>))

      expect(service.isNavigating).toBe(expected)
    })

    it('isRouteActive should check matchedRouteIds', () => {
      mockSubscribeCallback!(
        createMockRouterState({
          matches: [createMockMatch({}, RouteIds.Project)],
        }),
      )

      expect(service.isRouteActive(RouteIds.Project)).toBe(true)
      expect(service.isRouteActive(RouteIds.Table)).toBe(false)
    })
  })

  describe('router access', () => {
    it('should throw error when accessing router before initialization', () => {
      const service = createRouterService(bootstrapService)

      expect(() => service.router).toThrow('Router not found')
    })

    it('should return router after initialization', () => {
      const service = createRouterService(bootstrapService)
      bootstrapService.setLoaded()

      expect(service.router.navigate).toBeDefined()
      expect(service.router.subscribe).toBeDefined()
    })
  })

  describe('navigate', () => {
    it('should delegate to router.navigate', async () => {
      const service = createRouterService(bootstrapService)
      bootstrapService.setLoaded()

      await service.navigate('/new-path')

      expect(mockRouter.navigate).toHaveBeenCalledWith('/new-path')
    })
  })

  describe('dispose', () => {
    it('should unsubscribe from router', () => {
      const unsubscribe = jest.fn()
      mockRouter.subscribe = jest.fn(() => unsubscribe)

      const service = createRouterService(bootstrapService)
      bootstrapService.setLoaded()

      service.dispose()

      expect(unsubscribe).toHaveBeenCalled()
    })
  })
})
