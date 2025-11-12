import { makeAutoObservable, runInAction } from 'mobx'
import { SearchIn, SearchType } from 'src/__generated__/graphql-request.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { RouterService } from 'src/shared/model/RouterService.ts'
import { SearchItemModel } from 'src/widgets/SearchModal/model/SearchItemModel.ts'

const DEBOUNCE_DELAY = 500

enum State {
  init = 'init',
  loading = 'loading',
  results = 'results',
  noResults = 'noResults',
  error = 'error',
}

export class SearchModalModel implements IViewModel {
  public searchQuery = ''
  public selectedIndex = 0
  public isOpen = false

  private state = State.init
  private debounceTimeout: number | null = null

  private readonly searchRequest = ObservableRequest.of(client.searchRows, { skipResetting: true })

  constructor(
    private readonly context: ProjectContext,
    private readonly linkMaker: LinkMaker,
    private readonly router: RouterService,
  ) {
    makeAutoObservable(this)
  }

  public get isInit() {
    return this.state === State.init
  }

  public get isLoading() {
    return this.state === State.loading
  }

  public get hasResults() {
    return this.state === State.results
  }

  public get hasNoResults() {
    return this.state === State.noResults
  }

  public get hasError() {
    return this.state === State.error
  }

  public get results() {
    return this.searchRequest.data?.searchRows.edges.map((edge) => new SearchItemModel(edge.node, this.linkMaker)) ?? []
  }

  public setSearchQuery(query: string) {
    this.searchQuery = query
    this.selectedIndex = 0

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
      this.debounceTimeout = null
    }

    if (query.trim()) {
      this.state = State.loading

      this.debounceTimeout = setTimeout(() => {
        void this.request()
        this.debounceTimeout = null
      }, DEBOUNCE_DELAY) as unknown as number
    } else {
      this.state = State.init
    }
  }

  public selectNext() {
    if (this.results.length > 0) {
      this.selectedIndex = (this.selectedIndex + 1) % this.results.length
    }
  }

  public selectPrevious() {
    if (this.results.length > 0) {
      this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % this.results.length
    }
  }

  public openModal() {
    this.isOpen = true
    this.reset()
  }

  public closeModal() {
    this.isOpen = false
    this.reset()
  }

  public async navigateToResult(result: SearchItemModel) {
    this.closeModal()
    await this.router.navigate(result.link)
  }

  public async navigateToSelected() {
    if (this.results[this.selectedIndex]) {
      await this.navigateToResult(this.results[this.selectedIndex])
    }
    return null
  }

  public init() {}

  public dispose(): void {
    // Clear any pending debounce timeout
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
      this.debounceTimeout = null
    }
    this.reset()
  }

  private reset() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
      this.debounceTimeout = null
    }
    this.searchQuery = ''
    this.selectedIndex = 0
    this.state = State.init
  }

  private async request(): Promise<void> {
    try {
      runInAction(() => {
        this.state = State.loading
      })

      const result = await this.searchRequest.fetch({
        data: {
          query: this.searchQuery,
          revisionId: this.context.revision.id,
          searchType: SearchType.Plain,
          searchIn: SearchIn.Values,
          first: 20,
        },
      })

      runInAction(() => {
        if (result.isRight) {
          this.state = result.data.searchRows.edges.length > 0 ? State.results : State.noResults
        } else {
          this.state = State.error
        }
      })
    } catch (e) {
      runInAction(() => {
        this.state = State.error
      })
      console.error('Search error:', e)
    }
  }
}

container.register(
  SearchModalModel,
  () => {
    const context = container.get(ProjectContext)
    const linkMaler = new LinkMaker(context)
    const router = container.get(RouterService)

    return new SearchModalModel(context, linkMaler, router)
  },
  { scope: 'request' },
)
