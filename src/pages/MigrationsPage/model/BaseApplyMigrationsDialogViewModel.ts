import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { VirtuosoHandle } from 'react-virtuoso'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { ApplyMigrationStatus } from 'src/__generated__/graphql-request'
import { ApplyMigrationResult, MigrationsDataSource } from 'src/pages/MigrationsPage/api/MigrationsDataSource.ts'
import { MigrationData, MigrationDiffItem } from 'src/pages/MigrationsPage/config/types.ts'
import { ViewMode } from 'src/pages/MigrationsPage/config/viewMode.ts'
import {
  diffMigrations,
  getDiffSummary,
  getMigrationsToApply,
  hasConflicts,
} from 'src/pages/MigrationsPage/lib/diffMigrations.ts'

export interface DiffSummary {
  toApply: number
  toSkip: number
  conflicts: number
  blocked: number
}

export interface ApplyResultSummary {
  applied: number
  skipped: number
  failed: number
  hasFailures: boolean
}

export abstract class BaseApplyMigrationsDialogViewModel {
  protected _isOpen = false
  protected _sourceMigrations: MigrationData[] = []
  protected _diffResult: MigrationDiffItem[] = []
  protected _viewMode: ViewMode = ViewMode.Table
  protected _applyResult: ApplyMigrationResult[] | null = null
  protected _isApplying = false
  private _virtuosoRef: VirtuosoHandle | null = null

  constructor(
    protected readonly context: ProjectContext,
    protected readonly dataSource: MigrationsDataSource,
    protected readonly existingMigrations: MigrationData[],
    protected readonly onApplied: () => void,
  ) {
    makeObservable<
      BaseApplyMigrationsDialogViewModel,
      '_isOpen' | '_sourceMigrations' | '_diffResult' | '_viewMode' | '_applyResult' | '_isApplying' | 'resetBase'
    >(this, {
      _isOpen: observable,
      _sourceMigrations: observable,
      _diffResult: observable,
      _viewMode: observable,
      _applyResult: observable,
      _isApplying: observable,
      isOpen: computed,
      previewItems: computed,
      migrationsToApply: computed,
      hasConflict: computed,
      canApply: computed,
      summary: computed,
      canRemoveLast: computed,
      viewMode: computed,
      isApplying: computed,
      applyResult: computed,
      applyResultSummary: computed,
      failedResults: computed,
      showResult: computed,
      setViewMode: action.bound,
      setVirtuosoRef: action.bound,
      removeLastMigration: action.bound,
      apply: action.bound,
      close: action.bound,
      resetBase: action.bound,
    })
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get previewItems(): MigrationDiffItem[] {
    return this._diffResult
  }

  public get migrationsToApply(): MigrationData[] {
    return getMigrationsToApply(this._diffResult)
  }

  public get hasConflict(): boolean {
    return hasConflicts(this._diffResult)
  }

  public get canApply(): boolean {
    return !this.hasConflict && this.migrationsToApply.length > 0 && !this._isApplying
  }

  public get summary(): DiffSummary {
    return getDiffSummary(this._diffResult)
  }

  public get canRemoveLast(): boolean {
    return this._sourceMigrations.length > 0
  }

  public get viewMode(): ViewMode {
    return this._viewMode
  }

  public get isApplying(): boolean {
    return this._isApplying
  }

  public get applyResult(): ApplyMigrationResult[] | null {
    return this._applyResult
  }

  public get applyResultSummary(): ApplyResultSummary | null {
    if (!this._applyResult) {
      return null
    }

    const applied = this._applyResult.filter((r) => r.status === ApplyMigrationStatus.Applied).length
    const skipped = this._applyResult.filter((r) => r.status === ApplyMigrationStatus.Skipped).length
    const failed = this._applyResult.filter((r) => r.status === ApplyMigrationStatus.Failed).length

    return {
      applied,
      skipped,
      failed,
      hasFailures: failed > 0,
    }
  }

  public get failedResults(): ApplyMigrationResult[] {
    if (!this._applyResult) {
      return []
    }
    return this._applyResult.filter((r) => r.status === ApplyMigrationStatus.Failed)
  }

  public get showResult(): boolean {
    return this._applyResult !== null
  }

  public setViewMode(mode: ViewMode): void {
    this._viewMode = mode
  }

  public setVirtuosoRef(ref: VirtuosoHandle | null): void {
    this._virtuosoRef = ref
  }

  public removeLastMigration(): void {
    if (this._sourceMigrations.length === 0) {
      return
    }
    this._sourceMigrations = this._sourceMigrations.slice(0, -1)
    this.recalculateDiff()
  }

  public copyFilteredJson(): void {
    void navigator.clipboard.writeText(JSON.stringify(this.migrationsToApply, null, 2))
  }

  public async apply(): Promise<void> {
    if (!this.canApply) {
      return
    }

    this._isApplying = true

    const result = await this.dataSource.applyMigrations(this.context.revisionId, this.migrationsToApply)

    runInAction(() => {
      this._isApplying = false

      if (!result) {
        return
      }

      this._applyResult = result

      if (result.every((r) => r.status !== ApplyMigrationStatus.Failed)) {
        this.context.updateTouched(true)
        this.onApplied()
      }
    })
  }

  public close(): void {
    this._isOpen = false
    this.reset()
  }

  public dispose(): void {
    this.reset()
  }

  protected recalculateDiff(): void {
    this._diffResult = diffMigrations(this._sourceMigrations, this.existingMigrations)
    this.scrollToLast()
  }

  protected resetBase(): void {
    this._sourceMigrations = []
    this._diffResult = []
    this._applyResult = null
    this._isApplying = false
    this._virtuosoRef = null
  }

  private scrollToLast(): void {
    if (this._diffResult.length > 0 && this._viewMode === ViewMode.Table) {
      setTimeout(() => {
        this._virtuosoRef?.scrollToIndex({
          index: this._diffResult.length - 1,
          behavior: 'smooth',
        })
      }, 100)
    }
  }

  protected abstract reset(): void
}
