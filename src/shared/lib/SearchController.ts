import { makeAutoObservable } from 'mobx'

export class SearchController {
  private _query = ''
  private _timeout: NodeJS.Timeout | null = null

  constructor(
    private readonly debounceMs: number,
    private readonly onSearch: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get query(): string {
    return this._query
  }

  public get isSearching(): boolean {
    return this._query.length > 0
  }

  public setQuery(query: string): void {
    this._query = query
    this.scheduleSearch()
  }

  public clear(): void {
    this._query = ''
    this.cancelScheduled()
    this.onSearch()
  }

  public reset(): void {
    this._query = ''
    this.cancelScheduled()
  }

  public dispose(): void {
    this.cancelScheduled()
  }

  private scheduleSearch(): void {
    this.cancelScheduled()
    this._timeout = setTimeout(() => {
      this.onSearch()
    }, this.debounceMs)
  }

  private cancelScheduled(): void {
    if (this._timeout) {
      clearTimeout(this._timeout)
      this._timeout = null
    }
  }
}
