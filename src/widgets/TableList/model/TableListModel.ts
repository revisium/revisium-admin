import { action, computed, makeObservable, reaction } from 'mobx'
import { TableListItemFragment } from 'src/__generated__/graphql-request.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container, PaginatedListViewModel } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { TableListDataSource } from 'src/widgets/TableList/model/TableListDataSource.ts'
import { TableListItemViewModel } from 'src/widgets/TableList/model/TableListItemViewModel.ts'
import { TableRemoveDataSource } from 'src/widgets/TableList/model/TableRemoveDataSource.ts'
import { TableListRefreshService } from 'src/widgets/TableList/model/TableListRefreshService.ts'

export class TableListModel extends PaginatedListViewModel<TableListItemFragment, TableListItemViewModel> {
  private unsubscribeRefresh: (() => void) | null = null
  private disposeRevisionReaction: (() => void) | null = null

  constructor(
    dataSource: TableListDataSource,
    private readonly removeDataSource: TableRemoveDataSource,
    private readonly projectContext: ProjectContext,
    private readonly permissionContext: PermissionContext,
    private readonly refreshService: TableListRefreshService,
  ) {
    super(dataSource)

    makeObservable(this, {
      isEditableRevision: computed,
      canCreateTable: computed,
      canUpdateTable: computed,
      canDeleteTable: computed,
      showMenu: computed,
      removeTable: action,
    })
  }

  protected getItemKey(item: TableListItemFragment): string {
    return item.versionId
  }

  protected createItemViewModel(item: TableListItemFragment): TableListItemViewModel {
    return new TableListItemViewModel(item)
  }

  public get isEditableRevision(): boolean {
    return this.projectContext.isDraftRevision
  }

  public get canCreateTable(): boolean {
    return this.isEditableRevision && this.permissionContext.canCreateTable
  }

  public get canUpdateTable(): boolean {
    return this.isEditableRevision && this.permissionContext.canUpdateTable
  }

  public get canDeleteTable(): boolean {
    return this.isEditableRevision && this.permissionContext.canDeleteTable
  }

  public get showMenu(): boolean {
    return this.canUpdateTable || this.canCreateTable || this.canDeleteTable
  }

  public override init(): void {
    this.load()
    this.unsubscribeRefresh = this.refreshService.subscribe(() => this.load())
    this.disposeRevisionReaction = reaction(
      () => this.projectContext.revisionId,
      () => this.load(),
    )
  }

  private load(): void {
    this.dataSource.reset()
    void (this.dataSource as TableListDataSource).load({ revisionId: this.projectContext.revisionId })
  }

  public override dispose(): void {
    this.unsubscribeRefresh?.()
    this.disposeRevisionReaction?.()
    super.dispose()
    this.removeDataSource.dispose()
  }

  public async removeTable(tableId: string): Promise<boolean> {
    const result = await this.removeDataSource.remove({
      revisionId: this.projectContext.revisionId,
      tableId,
    })

    if (result) {
      if (!this.projectContext.touched) {
        this.projectContext.updateTouched(true)
      }
      this.load()
    }

    return result
  }
}

container.register(
  TableListModel,
  () => {
    const dataSource = container.get(TableListDataSource)
    const removeDataSource = container.get(TableRemoveDataSource)
    const projectContext = container.get(ProjectContext)
    const permissionContext = container.get(PermissionContext)
    const refreshService = container.get(TableListRefreshService)
    return new TableListModel(dataSource, removeDataSource, projectContext, permissionContext, refreshService)
  },
  { scope: 'request' },
)
