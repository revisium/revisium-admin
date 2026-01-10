import { action, computed, makeObservable, observable } from 'mobx'
import { BranchItemFragment } from 'src/__generated__/graphql-request.ts'
import { container, PaginatedListViewModel } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { BranchesDataSource } from '../api/BranchesDataSource.ts'
import { BranchItemViewModel, BranchItemViewModelFactory } from './BranchItemViewModel.ts'
import { CreateBranchDialogViewModel, CreateBranchDialogViewModelFactory } from './CreateBranchDialogViewModel.ts'

export class BranchesPageViewModel extends PaginatedListViewModel<BranchItemFragment, BranchItemViewModel> {
  private _createDialogViewModel: CreateBranchDialogViewModel | null = null

  constructor(
    private readonly permissionContext: PermissionContext,
    protected readonly dataSource: BranchesDataSource,
    private readonly itemFactory: BranchItemViewModelFactory,
    private readonly createDialogFactory: CreateBranchDialogViewModelFactory,
  ) {
    super(dataSource)
    makeObservable<BranchesPageViewModel, '_createDialogViewModel' | 'handleBranchCreated'>(this, {
      _createDialogViewModel: observable,
      createDialog: computed,
      handleItemDeleted: action.bound,
      handleBranchCreated: action.bound,
      openCreateDialog: action.bound,
    })
  }

  protected getItemKey(item: BranchItemFragment): string {
    return item.id
  }

  protected createItemViewModel(item: BranchItemFragment): BranchItemViewModel {
    return this.itemFactory.create(item, this.handleItemDeleted)
  }

  public get canCreateBranch(): boolean {
    return this.permissionContext.canCreateBranch
  }

  public get createDialog(): CreateBranchDialogViewModel | null {
    return this._createDialogViewModel
  }

  public openCreateDialog(): void {
    this._createDialogViewModel ??= this.createDialogFactory.create(this.handleBranchCreated)
    this._createDialogViewModel.open()
  }

  private handleBranchCreated(): void {
    void this.dataSource.reload()
  }

  public handleItemDeleted(): void {
    void this.dataSource.reload()
  }

  public override dispose(): void {
    this._createDialogViewModel?.dispose()
    super.dispose()
  }
}

container.register(
  BranchesPageViewModel,
  () => {
    const permissionContext = container.get(PermissionContext)
    const dataSource = container.get(BranchesDataSource)
    const itemFactory = container.get(BranchItemViewModelFactory)
    const createDialogFactory = container.get(CreateBranchDialogViewModelFactory)
    return new BranchesPageViewModel(permissionContext, dataSource, itemFactory, createDialogFactory)
  },
  { scope: 'request' },
)
