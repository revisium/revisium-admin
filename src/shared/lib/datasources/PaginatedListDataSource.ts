/* eslint-disable @typescript-eslint/no-explicit-any */

import { action, computed, makeObservable, runInAction } from 'mobx'
import { isAborted } from '../Either.ts'
import { ObservableRequest } from '../ObservableRequest.ts'
import { PaginatedListState, PaginationState } from 'src/shared/lib'
import { IPaginatedDataSource, IPaginatedDataSourceConfig } from './interfaces.ts'

export abstract class PaginatedListDataSource<TItem, TResponse, TFilters = void>
  implements IPaginatedDataSource<TItem>
{
  protected readonly listState = new PaginatedListState<TItem>()
  protected readonly request: ObservableRequest<TResponse, any, any>
  protected readonly config: Required<IPaginatedDataSourceConfig>

  protected constructor(
    fetchFunction: (...args: any[]) => Promise<TResponse>,
    config: IPaginatedDataSourceConfig = {},
  ) {
    this.request = ObservableRequest.of(fetchFunction, { skipResetting: true })
    this.config = { pageSize: config.pageSize ?? 50 }

    makeObservable(
      this,
      {
        items: computed,
        hasNextPage: computed,
        totalCount: computed,
        isLoading: computed,
        isInitialLoad: computed,
        state: computed,
        load: action,
        loadNextPage: action,
        reset: action,
        dispose: action,
      },
      { autoBind: true },
    )
  }

  protected abstract extractItems(response: TResponse): TItem[]

  protected abstract extractPageInfo(response: TResponse): {
    hasNextPage: boolean
    endCursor: string | null
    totalCount: number
  }

  protected abstract buildFetchArgs(filters?: TFilters, cursor?: string): any

  public get items(): TItem[] {
    return this.listState.items
  }

  public get hasNextPage(): boolean {
    return this.listState.hasNextPage
  }

  public get totalCount(): number {
    return this.listState.totalCount
  }

  public get isLoading(): boolean {
    return this.request.isLoading
  }

  public get isInitialLoad(): boolean {
    return this.listState.isInitialLoad
  }

  public get state(): PaginationState {
    return this.listState.state
  }

  public async load(filters?: TFilters): Promise<void> {
    this.listState.setLoading()

    const result = await this.request.fetch(this.buildFetchArgs(filters))

    if (!result.isRight) {
      if (isAborted(result)) {
        return
      }

      runInAction(() => {
        this.listState.setError()
      })
      return
    }

    runInAction(() => {
      const items = this.extractItems(result.data)
      const pageInfo = this.extractPageInfo(result.data)

      this.listState.setItems(items, pageInfo)
    })
  }

  public async loadNextPage(): Promise<boolean> {
    if (!this.hasNextPage || this.isLoading) {
      return false
    }

    const result = await this.request.fetch(this.buildFetchArgs(undefined, this.listState.endCursor || undefined))

    if (result.isRight) {
      runInAction(() => {
        const newItems = this.extractItems(result.data)
        const pageInfo = this.extractPageInfo(result.data)

        this.listState.appendItems(newItems, {
          hasNextPage: pageInfo.hasNextPage,
          endCursor: pageInfo.endCursor,
        })
      })
      return true
    }

    return false
  }

  public reset(): void {
    this.listState.reset()
    this.request.abort()
  }

  public dispose(): void {
    this.request.abort()
  }
}
