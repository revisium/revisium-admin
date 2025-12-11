import { makeAutoObservable } from 'mobx'

export enum ListState {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  notFound = 'notFound',
  error = 'error',
}

export class AsyncListState<T> {
  private _state = ListState.loading
  private _items: T[] = []
  private _hasNextPage = false
  private _endCursor: string | null = null
  private _totalCount = 0
  private _isInitialLoad = true

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get state(): ListState {
    return this._state
  }

  public get items(): T[] {
    return this._items
  }

  public get hasNextPage(): boolean {
    return this._hasNextPage
  }

  public get endCursor(): string | null {
    return this._endCursor
  }

  public get totalCount(): number {
    return this._totalCount
  }

  public get isInitialLoad(): boolean {
    return this._isInitialLoad
  }

  public get showLoading(): boolean {
    return this._state === ListState.loading && this._isInitialLoad
  }

  public get showEmpty(): boolean {
    return this._state === ListState.empty
  }

  public get showNotFound(): boolean {
    return this._state === ListState.notFound
  }

  public get showList(): boolean {
    return this._state === ListState.list
  }

  public get showError(): boolean {
    return this._state === ListState.error
  }

  public setLoading(): void {
    this._state = ListState.loading
  }

  public setError(): void {
    this._isInitialLoad = false
    this._state = ListState.error
  }

  public setItems(
    items: T[],
    options: {
      hasNextPage: boolean
      endCursor: string | null
      totalCount: number
      isSearching?: boolean
    },
  ): void {
    this._isInitialLoad = false
    this._items = items
    this._hasNextPage = options.hasNextPage
    this._endCursor = options.endCursor
    this._totalCount = options.totalCount

    if (items.length > 0) {
      this._state = ListState.list
    } else if (options.isSearching) {
      this._state = ListState.notFound
    } else {
      this._state = ListState.empty
    }
  }

  public appendItems(
    newItems: T[],
    options: {
      hasNextPage: boolean
      endCursor: string | null
    },
  ): void {
    this._items = [...this._items, ...newItems]
    this._hasNextPage = options.hasNextPage
    this._endCursor = options.endCursor
  }

  public removeItem(predicate: (item: T) => boolean): void {
    const originalLength = this._items.length
    this._items = this._items.filter((item) => !predicate(item))
    const removedCount = originalLength - this._items.length
    this._totalCount = Math.max(0, this._totalCount - removedCount)
  }

  public updateStateAfterRemove(isSearching: boolean): void {
    if (this._items.length === 0) {
      this._state = isSearching ? ListState.notFound : ListState.empty
    }
  }

  public reset(): void {
    this._items = []
    this._hasNextPage = false
    this._endCursor = null
    this._isInitialLoad = false
    this._state = ListState.loading
  }

  public resetToLoading(): void {
    this._items = []
    this._hasNextPage = false
    this._endCursor = null
    this._totalCount = 0
    this._isInitialLoad = true
    this._state = ListState.loading
  }
}
