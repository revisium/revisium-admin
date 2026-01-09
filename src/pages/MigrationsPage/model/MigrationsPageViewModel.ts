import { IReactionDisposer, makeAutoObservable, reaction, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { MigrationsDataSource } from 'src/pages/MigrationsPage/api/MigrationsDataSource.ts'
import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import { ViewMode } from 'src/pages/MigrationsPage/config/viewMode.ts'
import { parsePatches } from 'src/pages/MigrationsPage/lib/parsePatches.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import {
  ApplyFromBranchDialogViewModel,
  ApplyFromBranchDialogViewModelFactory,
} from './ApplyFromBranchDialogViewModel.ts'
import {
  ApplyMigrationsDialogViewModel,
  ApplyMigrationsDialogViewModelFactory,
} from './ApplyMigrationsDialogViewModel.ts'
import { MigrationItemViewModel, MigrationItemViewModelFactory } from './MigrationItemViewModel.ts'

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  error = 'error',
}

export class MigrationsPageViewModel implements IViewModel {
  private _state = State.loading
  private _viewMode: ViewMode = ViewMode.Table
  private _migrations: MigrationData[] = []
  private _revisionReaction: IReactionDisposer | null = null
  private _applyDialog: ApplyMigrationsDialogViewModel | null = null
  private _applyFromBranchDialog: ApplyFromBranchDialogViewModel | null = null

  constructor(
    private readonly context: ProjectContext,
    private readonly permissionContext: PermissionContext,
    private readonly dataSource: MigrationsDataSource,
    private readonly applyDialogFactory: ApplyMigrationsDialogViewModelFactory,
    private readonly applyFromBranchDialogFactory: ApplyFromBranchDialogViewModelFactory,
    private readonly migrationItemFactory: MigrationItemViewModelFactory,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get showLoading(): boolean {
    return this._state === State.loading
  }

  public get showError(): boolean {
    return this._state === State.error
  }

  public get showEmpty(): boolean {
    return this._state === State.empty
  }

  public get showList(): boolean {
    return this._state === State.list
  }

  public get data(): MigrationData[] {
    return this._migrations
  }

  private get patchItems(): MigrationItemViewModel[] {
    return parsePatches(this._migrations)
      .reverse()
      .map((patchData) => this.migrationItemFactory.create(patchData))
  }

  public get items(): MigrationItemViewModel[] {
    return this.patchItems
  }

  public get viewMode(): ViewMode {
    return this._viewMode
  }

  public get isTableMode(): boolean {
    return this._viewMode === ViewMode.Table
  }

  public setViewMode(mode: ViewMode): void {
    this._viewMode = mode
  }

  public get isEmpty(): boolean {
    return this._migrations.length === 0
  }

  public get totalCount(): number {
    return this.patchItems.length
  }

  public get migrationsCount(): number {
    return this._migrations.length
  }

  public get canApplyMigrations(): boolean {
    return this.permissionContext.canCreateTable
  }

  public get branchName(): string {
    return this.context.branchName
  }

  public get applyDialog(): ApplyMigrationsDialogViewModel | null {
    return this._applyDialog
  }

  public get applyFromBranchDialog(): ApplyFromBranchDialogViewModel | null {
    return this._applyFromBranchDialog
  }

  public openApplyDialog(): void {
    this._applyDialog = this.applyDialogFactory.create(this._migrations, this.handleMigrationsApplied)
    this._applyDialog.open()
  }

  public openApplyFromBranchDialog(): void {
    this._applyFromBranchDialog = this.applyFromBranchDialogFactory.create(
      this._migrations,
      this.handleMigrationsApplied,
      this.context.branchId,
    )
    this._applyFromBranchDialog.open()
  }

  public copyMigrationsJson(): void {
    void navigator.clipboard.writeText(JSON.stringify(this._migrations, null, 2))
  }

  public init(): void {
    void this.load()
    this._revisionReaction = reaction(
      () => this.context.revisionId,
      () => {
        this.reset()
        void this.load()
      },
    )
  }

  public dispose(): void {
    this._revisionReaction?.()
    this._revisionReaction = null
    this._applyDialog?.dispose()
    this._applyFromBranchDialog?.dispose()
    this.dataSource.dispose()
  }

  public async reload(): Promise<void> {
    await this.load()
  }

  private reset(): void {
    this._state = State.loading
    this._migrations = []
  }

  private async load(): Promise<void> {
    const migrations = await this.dataSource.getMigrations(this.context.revisionId)

    runInAction(() => {
      if (migrations === null) {
        if (!this.dataSource.wasAborted) {
          this._state = State.error
        }
        return
      }

      this._migrations = migrations
      this._state = migrations.length > 0 ? State.list : State.empty
    })
  }

  private readonly handleMigrationsApplied = (): void => {
    void this.reload()
  }
}

container.register(
  MigrationsPageViewModel,
  () => {
    const context = container.get(ProjectContext)
    const permissionContext = container.get(PermissionContext)
    const dataSource = container.get(MigrationsDataSource)
    const applyDialogFactory = container.get(ApplyMigrationsDialogViewModelFactory)
    const applyFromBranchDialogFactory = container.get(ApplyFromBranchDialogViewModelFactory)
    const migrationItemFactory = container.get(MigrationItemViewModelFactory)

    return new MigrationsPageViewModel(
      context,
      permissionContext,
      dataSource,
      applyDialogFactory,
      applyFromBranchDialogFactory,
      migrationItemFactory,
    )
  },
  { scope: 'request' },
)
