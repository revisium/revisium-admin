import { PaginationState } from 'src/shared/lib'

export interface IPaginatedDataSource<TItem> {
  readonly items: TItem[]
  readonly hasNextPage: boolean
  readonly totalCount: number
  readonly isLoading: boolean
  readonly isInitialLoad: boolean
  readonly state: PaginationState

  load(): Promise<void>
  loadNextPage(): Promise<boolean>
  reset(): void
  dispose(): void
}

export interface IPaginatedDataSourceConfig {
  pageSize?: number
}
