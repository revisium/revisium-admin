import { makeAutoObservable, runInAction } from 'mobx'
import { SearchIn, SearchType } from 'src/__generated__/graphql-request.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  notFound = 'notFound',
  error = 'error',
}

export class SearchForeignKeyViewModel implements IViewModel {
  private state = State.loading

  public search = ''
  public revisionId = ''
  public tableId = ''

  private readonly findForeignKey = ObservableRequest.of(client.findForeignKey, { skipResetting: true })
  private searchTimeout: NodeJS.Timeout | null = null

  constructor() {
    makeAutoObservable(this)
  }

  public get showInput() {
    const allowedStates: State[] = [State.list, State.notFound]
    return allowedStates.includes(this.state)
  }

  public get showFooter() {
    const allowedStates: State[] = [State.list, State.notFound, State.error, State.empty]
    return allowedStates.includes(this.state)
  }

  public get showLoading() {
    return this.state === State.loading
  }

  public get showNotFound() {
    return this.state === State.notFound
  }

  public get showError() {
    return this.state === State.error
  }

  public get showEmpty() {
    return this.state === State.empty
  }

  public get showList() {
    return this.state === State.list
  }

  public get items() {
    return this.findForeignKey.data?.rows.edges.map((edge) => edge.node.id) ?? []
  }

  public init(revisionId: string, tableId: string) {
    this.revisionId = revisionId
    this.tableId = tableId

    void this.request(true)
  }

  public dispose(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  }

  public setSearch(search: string, skipDelay?: boolean): void {
    this.search = search

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }

    if (skipDelay) {
      void this.request()
    } else {
      this.searchTimeout = setTimeout(() => {
        void this.request()
      }, 300)
    }
  }

  private async request(isInitRequest?: boolean): Promise<void> {
    try {
      const result = await this.findForeignKey.fetch({
        data: {
          first: 100,
          revisionId: this.revisionId,
          tableId: this.tableId,
          where: this.search
            ? {
                OR: [
                  {
                    id: {
                      contains: this.search,
                    },
                  },
                  {
                    data: {
                      path: [],
                      search: this.search,
                      searchType: SearchType.Plain,
                      searchIn: SearchIn.Values,
                    },
                  },
                ],
              }
            : undefined,
        },
      })

      runInAction(() => {
        if (isInitRequest && result.isRight) {
          this.state = result.data.rows.totalCount ? State.list : State.empty
        } else if (!isInitRequest && result.isRight) {
          this.state = result.data.rows.totalCount ? State.list : State.notFound
        }
      })
    } catch (e) {
      runInAction(() => {
        this.state = State.error
      })
      console.error(e)
    }
  }
}

container.register(
  SearchForeignKeyViewModel,
  () => {
    return new SearchForeignKeyViewModel()
  },
  { scope: 'request' },
)
