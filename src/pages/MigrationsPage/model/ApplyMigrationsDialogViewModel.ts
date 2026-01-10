import { action, computed, makeObservable, observable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { MigrationsDataSource } from 'src/pages/MigrationsPage/api/MigrationsDataSource.ts'
import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import { BaseApplyMigrationsDialogViewModel } from './BaseApplyMigrationsDialogViewModel.ts'

export type ApplyMigrationsDialogViewModelFactoryFn = (
  existingMigrations: MigrationData[],
  onApplied: () => void,
) => ApplyMigrationsDialogViewModel

export class ApplyMigrationsDialogViewModelFactory {
  constructor(public readonly create: ApplyMigrationsDialogViewModelFactoryFn) {}
}

export class ApplyMigrationsDialogViewModel extends BaseApplyMigrationsDialogViewModel {
  private _jsonInput = ''
  private _parseError: string | null = null

  constructor(
    context: ProjectContext,
    dataSource: MigrationsDataSource,
    existingMigrations: MigrationData[],
    onApplied: () => void,
  ) {
    super(context, dataSource, existingMigrations, onApplied)

    makeObservable<ApplyMigrationsDialogViewModel, '_jsonInput' | '_parseError'>(this, {
      _jsonInput: observable,
      _parseError: observable,
      jsonInput: computed,
      parseError: computed,
      setJsonInput: action.bound,
      open: action.bound,
    })
  }

  public get jsonInput(): string {
    return this._jsonInput
  }

  public get parseError(): string | null {
    return this._parseError
  }

  public setJsonInput(json: string): void {
    this._jsonInput = json
    this._applyResult = null
    this.parseAndDiff()
  }

  public override removeLastMigration(): void {
    if (this._sourceMigrations.length === 0) {
      return
    }

    this._sourceMigrations = this._sourceMigrations.slice(0, -1)
    this._jsonInput = JSON.stringify(this._sourceMigrations, null, 2)
    this.recalculateDiff()
  }

  public open(): void {
    this._isOpen = true
  }

  protected override reset(): void {
    this._jsonInput = ''
    this._parseError = null
    this.resetBase()
  }

  private parseAndDiff(): void {
    if (!this._jsonInput.trim()) {
      this._parseError = null
      this._sourceMigrations = []
      this._diffResult = []
      return
    }

    try {
      const parsed = JSON.parse(this._jsonInput)

      if (!Array.isArray(parsed)) {
        this._parseError = 'Input must be an array of migrations'
        this._sourceMigrations = []
        this._diffResult = []
        return
      }

      this._parseError = null
      this._sourceMigrations = parsed as MigrationData[]
      this.recalculateDiff()
    } catch {
      this._parseError = 'Invalid JSON format'
      this._sourceMigrations = []
      this._diffResult = []
    }
  }
}

container.register(
  ApplyMigrationsDialogViewModelFactory,
  () => {
    return new ApplyMigrationsDialogViewModelFactory((existingMigrations, onApplied) => {
      const context = container.get(ProjectContext)
      const dataSource = container.get(MigrationsDataSource)
      return new ApplyMigrationsDialogViewModel(context, dataSource, existingMigrations, onApplied)
    })
  },
  { scope: 'request' },
)
