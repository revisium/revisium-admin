import { Router, RouterState } from '@remix-run/router'
import { makeAutoObservable, reaction } from 'mobx'
import { createBrowserRouter, matchRoutes } from 'react-router-dom'
import { ROOT_ROUTES } from 'src/app/config/rootRoutes.tsx'
import { container } from 'src/shared/lib'
import { BootstrapService } from 'src/shared/model/BootstrapService.ts'
import { RouteIds } from 'src/shared/config/routes.ts'
import { RouterParams } from './RouterParams.ts'
import { extractLocationData, extractMatchedRouteIds, extractParamsFromMatches } from './routerUtils.ts'

export type NavigationState = 'idle' | 'loading' | 'submitting'

export class RouterService {
  private _router: Router | null = null
  private _unsubscribe: (() => void) | null = null

  private _pathname = '/'
  private _search = ''
  private _hash = ''
  private _navigationState: NavigationState = 'idle'
  private _isInitialized = false
  private _matchedRouteIds: Set<string> = new Set()

  constructor(
    private readonly bootstrapService: BootstrapService,
    public readonly params: RouterParams,
  ) {
    makeAutoObservable(
      this,
      {
        params: false,
      },
      { autoBind: true },
    )
    this.init()
  }

  public get router(): Router {
    if (!this._router) {
      throw new Error('Router not found')
    }
    return this._router
  }

  public get isRouterReady(): boolean {
    return this._router !== null && this._isInitialized
  }

  public get pathname(): string {
    return this._pathname
  }

  public get search(): string {
    return this._search
  }

  public get hash(): string {
    return this._hash
  }

  public get navigationState(): NavigationState {
    return this._navigationState
  }

  public get isNavigating(): boolean {
    return this._navigationState !== 'idle'
  }

  public get isLoading(): boolean {
    return this._navigationState === 'loading'
  }

  public get matchedRouteIds(): Set<string> {
    return this._matchedRouteIds
  }

  public isRouteActive(routeId: RouteIds): boolean {
    return this._matchedRouteIds.has(routeId)
  }

  public get isInProject(): boolean {
    return this._matchedRouteIds.has(RouteIds.Project)
  }

  public get isInTable(): boolean {
    return this._matchedRouteIds.has(RouteIds.Table)
  }

  public get isInRow(): boolean {
    return this._matchedRouteIds.has(RouteIds.Row)
  }

  public navigate(...args: Parameters<Router['navigate']>): Promise<void> {
    return this.router.navigate(...args)
  }

  private init(): void {
    reaction(
      () => this.bootstrapService.isLoaded,
      (isLoaded) => {
        if (isLoaded) {
          this.createRouter()
        }
      },
      { fireImmediately: true },
    )
  }

  private createRouter(): void {
    this._router = createBrowserRouter(ROOT_ROUTES)
    this.handleRouterStateChange(this._router.state)
    this._unsubscribe = this._router.subscribe(this.handleRouterStateChange)
  }

  private handleRouterStateChange(state: RouterState) {
    this.updateParams(state)
    this.updateLocation(state)
    this.updateNavigationState(state)
    this.updateMatchedRouteIds(state)

    if (!this._isInitialized && state.initialized) {
      this._isInitialized = true
    }
  }

  private updateParams(state: RouterState): void {
    if (state.navigation.state !== 'idle' && state.navigation.location) {
      const targetMatches = matchRoutes(ROOT_ROUTES, state.navigation.location)
      if (targetMatches) {
        this.params.update(extractParamsFromMatches(targetMatches))
        return
      }
    }
    this.params.update(extractParamsFromMatches(state.matches))
  }

  private updateLocation(state: RouterState): void {
    const { pathname, search, hash } = extractLocationData(state.location)
    this._pathname = pathname
    this._search = search
    this._hash = hash
  }

  private updateNavigationState(state: RouterState): void {
    this._navigationState = state.navigation.state as NavigationState
  }

  private updateMatchedRouteIds(state: RouterState): void {
    this._matchedRouteIds = extractMatchedRouteIds(state.matches)
  }

  public dispose(): void {
    this._unsubscribe?.()
    this._unsubscribe = null
  }
}

container.register(
  RouterService,
  () => {
    const bootstrapService = container.get(BootstrapService)
    const params = container.get(RouterParams)
    return new RouterService(bootstrapService, params)
  },
  { scope: 'singleton' },
)
