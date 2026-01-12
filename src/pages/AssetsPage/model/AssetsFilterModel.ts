import { makeAutoObservable, runInAction } from 'mobx'
import {
  AssetsFilter,
  createDefaultFilter,
  FileSizeFilter,
  FileStatusFilter,
  FileTypeFilter,
} from 'src/pages/AssetsPage/lib/fileFilters'
import { container } from 'src/shared/lib'

const SEARCH_DEBOUNCE_MS = 300

export class AssetsFilterModel {
  private _filter: AssetsFilter = createDefaultFilter()
  private _searchInput = ''
  private _searchTimeout: NodeJS.Timeout | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get filter(): AssetsFilter {
    return this._filter
  }

  public get search(): string {
    return this._searchInput
  }

  public get type(): FileTypeFilter {
    return this._filter.type
  }

  public get status(): FileStatusFilter {
    return this._filter.status
  }

  public get size(): FileSizeFilter {
    return this._filter.size
  }

  public get tableId(): string | null {
    return this._filter.tableId
  }

  public get hasActiveFilters(): boolean {
    return (
      this._filter.search !== '' ||
      this._filter.type !== 'all' ||
      this._filter.status !== 'all' ||
      this._filter.size !== 'all' ||
      this._filter.tableId !== null
    )
  }

  public setSearch(value: string): void {
    this._searchInput = value
    this.scheduleSearchUpdate()
  }

  public dispose(): void {
    this.cancelScheduledSearch()
  }

  private scheduleSearchUpdate(): void {
    this.cancelScheduledSearch()
    this._searchTimeout = setTimeout(() => {
      runInAction(() => {
        this._filter = { ...this._filter, search: this._searchInput }
      })
    }, SEARCH_DEBOUNCE_MS)
  }

  private cancelScheduledSearch(): void {
    if (this._searchTimeout) {
      clearTimeout(this._searchTimeout)
      this._searchTimeout = null
    }
  }

  public setType(value: FileTypeFilter): void {
    this._filter = { ...this._filter, type: value }
  }

  public setStatus(value: FileStatusFilter): void {
    this._filter = { ...this._filter, status: value }
  }

  public setSize(value: FileSizeFilter): void {
    this._filter = { ...this._filter, size: value }
  }

  public setTableId(value: string | null): void {
    this._filter = { ...this._filter, tableId: value }
  }

  public clearFilters(): void {
    this.cancelScheduledSearch()
    this._searchInput = ''
    this._filter = createDefaultFilter()
  }

  public clearAllExceptTable(): void {
    this.cancelScheduledSearch()
    this._searchInput = ''
    this._filter = {
      ...createDefaultFilter(),
      tableId: this._filter.tableId,
    }
  }
}

container.register(AssetsFilterModel, () => new AssetsFilterModel(), { scope: 'request' })
