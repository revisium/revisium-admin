import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { DRAFT_TAG, HEAD_TAG } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { BranchWithRevisions, MigrationsDataSource } from 'src/pages/MigrationsPage/api/MigrationsDataSource.ts'
import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import { BaseApplyMigrationsDialogViewModel } from './BaseApplyMigrationsDialogViewModel.ts'

type RevisionOption = typeof HEAD_TAG | typeof DRAFT_TAG

export type ApplyFromBranchDialogViewModelFactoryFn = (
  existingMigrations: MigrationData[],
  onApplied: () => void,
  currentBranchId: string,
) => ApplyFromBranchDialogViewModel

export class ApplyFromBranchDialogViewModelFactory {
  constructor(public readonly create: ApplyFromBranchDialogViewModelFactoryFn) {}
}

export class ApplyFromBranchDialogViewModel extends BaseApplyMigrationsDialogViewModel {
  private _branches: BranchWithRevisions[] = []
  private _selectedBranchId: string | null = null
  private _selectedRevision: RevisionOption = DRAFT_TAG
  private _isLoadingBranches = false
  private _isLoadingMigrations = false

  constructor(
    context: ProjectContext,
    dataSource: MigrationsDataSource,
    existingMigrations: MigrationData[],
    onApplied: () => void,
    private readonly currentBranchId: string,
  ) {
    super(context, dataSource, existingMigrations, onApplied)

    makeObservable<
      ApplyFromBranchDialogViewModel,
      '_branches' | '_selectedBranchId' | '_selectedRevision' | '_isLoadingBranches' | '_isLoadingMigrations'
    >(this, {
      _branches: observable,
      _selectedBranchId: observable,
      _selectedRevision: observable,
      _isLoadingBranches: observable,
      _isLoadingMigrations: observable,
      branches: computed,
      hasNoBranches: computed,
      selectedBranchId: computed,
      selectedBranch: computed,
      selectedRevision: computed,
      isLoadingBranches: computed,
      isLoadingMigrations: computed,
      setSelectedBranchId: action.bound,
      setSelectedRevision: action.bound,
      open: action.bound,
    })
  }

  public get branches(): BranchWithRevisions[] {
    return this._branches.filter((b) => b.id !== this.currentBranchId)
  }

  public get hasNoBranches(): boolean {
    return this.branches.length === 0 && !this._isLoadingBranches
  }

  public get selectedBranchId(): string | null {
    return this._selectedBranchId
  }

  public get selectedBranch(): BranchWithRevisions | null {
    return this._branches.find((b) => b.id === this._selectedBranchId) ?? null
  }

  public get selectedRevision(): RevisionOption {
    return this._selectedRevision
  }

  public get isLoadingBranches(): boolean {
    return this._isLoadingBranches
  }

  public get isLoadingMigrations(): boolean {
    return this._isLoadingMigrations
  }

  public setSelectedBranchId(branchId: string | null): void {
    this._selectedBranchId = branchId
    this._applyResult = null

    if (branchId) {
      void this.loadMigrations()
    } else {
      this._sourceMigrations = []
      this._diffResult = []
    }
  }

  public setSelectedRevision(revision: RevisionOption): void {
    this._selectedRevision = revision
    this._applyResult = null

    if (this._selectedBranchId) {
      void this.loadMigrations()
    }
  }

  public async open(): Promise<void> {
    this._isOpen = true
    await this.loadBranches()
  }

  protected override reset(): void {
    this._selectedBranchId = null
    this._selectedRevision = DRAFT_TAG
    this._branches = []
    this._isLoadingBranches = false
    this._isLoadingMigrations = false
    this.resetBase()
  }

  private async loadBranches(): Promise<void> {
    this._isLoadingBranches = true

    const branches = await this.dataSource.getBranches(this.context.organizationId, this.context.projectName)

    runInAction(() => {
      this._isLoadingBranches = false
      this._branches = branches ?? []
    })
  }

  private async loadMigrations(): Promise<void> {
    const branch = this.selectedBranch
    if (!branch) {
      return
    }

    const revisionId = this._selectedRevision === HEAD_TAG ? branch.headRevisionId : branch.draftRevisionId

    this._isLoadingMigrations = true

    const migrations = await this.dataSource.getBranchMigrations(revisionId)

    runInAction(() => {
      this._isLoadingMigrations = false
      this._sourceMigrations = migrations ?? []
      this.recalculateDiff()
    })
  }
}

container.register(
  ApplyFromBranchDialogViewModelFactory,
  () => {
    const context = container.get(ProjectContext)
    const dataSource = container.get(MigrationsDataSource)

    return new ApplyFromBranchDialogViewModelFactory(
      (existingMigrations, onApplied, currentBranchId) =>
        new ApplyFromBranchDialogViewModel(context, dataSource, existingMigrations, onApplied, currentBranchId),
    )
  },
  { scope: 'request' },
)
