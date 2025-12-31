import { makeAutoObservable } from 'mobx'

export enum PaginationState {
  Loading = 'loading',
  Empty = 'empty',
  List = 'list',
  NotFound = 'notFound',
  Error = 'error',
}

export class PaginatedListState<T> {
  private _state = PaginationState.Loading
  private _items: T[] = []
  private _hasNextPage = false
  private _endCursor: string | null = null
  private _totalCount = 0
  private _isInitialLoad = true

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get state(): PaginationState {
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
    return this._state === PaginationState.Loading && this._isInitialLoad
  }

  public get showEmpty(): boolean {
    return this._state === PaginationState.Empty
  }

  public get showNotFound(): boolean {
    return this._state === PaginationState.NotFound
  }

  public get showList(): boolean {
    return this._state === PaginationState.List
  }

  public get showError(): boolean {
    return this._state === PaginationState.Error
  }

  public setLoading(): void {
    this._state = PaginationState.Loading
  }

  public setError(): void {
    this._isInitialLoad = false
    this._state = PaginationState.Error
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
      this._state = PaginationState.List
    } else if (options.isSearching) {
      this._state = PaginationState.NotFound
    } else {
      this._state = PaginationState.Empty
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
      this._state = isSearching ? PaginationState.NotFound : PaginationState.Empty
    }
  }

  public reset(): void {
    this._items = []
    this._hasNextPage = false
    this._endCursor = null
    this._isInitialLoad = false
    this._state = PaginationState.Loading
  }

  public resetToLoading(): void {
    this._items = []
    this._hasNextPage = false
    this._endCursor = null
    this._totalCount = 0
    this._isInitialLoad = true
    this._state = PaginationState.Loading
  }
}
