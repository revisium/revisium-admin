import { action, computed, makeObservable, observable } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { IPaginatedDataSource, PaginationState } from './index.ts'

export abstract class PaginatedListViewModel<TItem, TItemViewModel> implements IViewModel {
  private readonly cachedItemViewModels = observable.map<string, TItemViewModel>()

  constructor(protected readonly dataSource: IPaginatedDataSource<TItem>) {
    makeObservable<PaginatedListViewModel<TItem, TItemViewModel>, 'cachedItemViewModels' | 'getOrCreateItemViewModel'>(
      this,
      {
        cachedItemViewModels: observable,
        showLoading: computed,
        showEmpty: computed,
        showList: computed,
        showError: computed,
        items: computed,
        totalCount: computed,
        hasNextPage: computed,
        init: action,
        dispose: action,
        tryToFetchNextPage: action,
        getOrCreateItemViewModel: false,
      },
    )
  }

  protected abstract getItemKey(item: TItem): string
  protected abstract createItemViewModel(item: TItem): TItemViewModel

  public get showLoading(): boolean {
    return this.dataSource.state === PaginationState.Loading && this.dataSource.isInitialLoad
  }

  public get showEmpty(): boolean {
    return this.dataSource.state === PaginationState.Empty
  }

  public get showList(): boolean {
    return this.dataSource.state === PaginationState.List
  }

  public get showError(): boolean {
    return this.dataSource.state === PaginationState.Error
  }

  public get items(): TItemViewModel[] {
    return this.dataSource.items.map((item) => this.getOrCreateItemViewModel(item))
  }

  public get totalCount(): number {
    return this.dataSource.totalCount
  }

  public get hasNextPage(): boolean {
    return this.dataSource.hasNextPage
  }

  public init(): void {
    void this.dataSource.load()
  }

  public dispose(): void {
    this.dataSource.dispose()
    this.cachedItemViewModels.clear()
  }

  public async tryToFetchNextPage(): Promise<void> {
    await this.dataSource.loadNextPage()
  }

  private getOrCreateItemViewModel(item: TItem): TItemViewModel {
    const key = this.getItemKey(item)
    let viewModel = this.cachedItemViewModels.get(key)

    if (!viewModel) {
      viewModel = this.createItemViewModel(item)
      this.cachedItemViewModels.set(key, viewModel)
    }
    return viewModel
  }
}
