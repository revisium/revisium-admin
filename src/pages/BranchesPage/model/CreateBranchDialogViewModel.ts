import { makeAutoObservable, runInAction } from 'mobx'
import { container } from 'src/shared/lib'
import { BranchForSelect, CreateBranchDataSource, RevisionForSelect } from '../api/CreateBranchDataSource.ts'

export class CreateBranchDialogViewModel {
  private _isOpen = false
  private _branches: BranchForSelect[] = []
  private _selectedBranchId: string | null = null
  private _revisions: RevisionForSelect[] = []
  private _selectedRevisionId: string | null = null
  private _branchName = ''

  constructor(
    private readonly dataSource: CreateBranchDataSource,
    private readonly onCreated: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get branches(): BranchForSelect[] {
    return this._branches
  }

  public get selectedBranchId(): string | null {
    return this._selectedBranchId
  }

  public get selectedBranch(): BranchForSelect | null {
    return this._branches.find((b) => b.id === this._selectedBranchId) ?? null
  }

  public get revisions(): RevisionForSelect[] {
    return [...this._revisions].reverse()
  }

  public get selectedRevisionId(): string | null {
    return this._selectedRevisionId
  }

  public get selectedRevision(): RevisionForSelect | null {
    return this._revisions.find((r) => r.id === this._selectedRevisionId) ?? null
  }

  public get branchName(): string {
    return this._branchName
  }

  public get isLoadingBranches(): boolean {
    return this.dataSource.isLoadingBranches
  }

  public get isLoadingRevisions(): boolean {
    return this.dataSource.isLoadingRevisions
  }

  public get isCreating(): boolean {
    return this.dataSource.isCreating
  }

  public get canCreate(): boolean {
    return this._selectedRevisionId !== null && this._branchName.trim().length > 0 && !this.isCreating
  }

  public open(): void {
    this._isOpen = true
    this._selectedBranchId = null
    this._selectedRevisionId = null
    this._branchName = ''
    this._revisions = []
    void this.loadBranches()
  }

  public close(): void {
    this._isOpen = false
  }

  public selectBranch(branchId: string): void {
    if (this._selectedBranchId === branchId) {
      return
    }

    this._selectedBranchId = branchId
    this._selectedRevisionId = null
    this._revisions = []

    const branch = this._branches.find((b) => b.id === branchId)
    if (branch) {
      void this.loadRevisions(branch.name)
    }
  }

  public selectRevision(revisionId: string): void {
    this._selectedRevisionId = revisionId
  }

  public setBranchName(name: string): void {
    this._branchName = name
  }

  public handleBranchChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    this.selectBranch(e.target.value)
  }

  public handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setBranchName(e.target.value)
  }

  public handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && this.canCreate) {
      this.create()
    }
  }

  public async create(): Promise<void> {
    if (!this.canCreate || !this._selectedRevisionId) {
      return
    }

    const success = await this.dataSource.createBranch(this._selectedRevisionId, this._branchName.trim())

    if (success) {
      this.close()
      this.onCreated()
    }
  }

  private async loadBranches(): Promise<void> {
    const branches = await this.dataSource.getBranches()
    runInAction(() => {
      this._branches = branches
    })
  }

  private async loadRevisions(branchName: string): Promise<void> {
    const revisions = await this.dataSource.getRevisions(branchName)
    runInAction(() => {
      this._revisions = revisions
    })
  }

  public dispose(): void {
    this.dataSource.dispose()
  }
}

export type CreateBranchDialogViewModelFactoryFn = (onCreated: () => void) => CreateBranchDialogViewModel

export class CreateBranchDialogViewModelFactory {
  constructor(public readonly create: CreateBranchDialogViewModelFactoryFn) {}
}

container.register(
  CreateBranchDialogViewModelFactory,
  () => {
    return new CreateBranchDialogViewModelFactory((onCreated) => {
      const dataSource = container.get(CreateBranchDataSource)
      return new CreateBranchDialogViewModel(dataSource, onCreated)
    })
  },
  { scope: 'request' },
)
