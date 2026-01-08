import { action, computed, makeObservable, observable } from 'mobx'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { UpdateRowCommand } from '../commands'
import { RowStackItemType } from '../../config/types.ts'
import { RowEditorItemBase, RowEditorItemBaseDeps } from './RowEditorItemBase.ts'

export type RowUpdatingItemDeps = RowEditorItemBaseDeps

export class RowUpdatingItem extends RowEditorItemBase {
  public readonly type = RowStackItemType.Updating
  public readonly store: RowDataCardStore
  public readonly originalRowId: string

  private _isLoading = false

  private readonly updateRowCommand: UpdateRowCommand

  constructor(
    deps: RowUpdatingItemDeps,
    isSelectingForeignKey: boolean,
    store: RowDataCardStore,
    originalRowId: string,
  ) {
    super(deps, isSelectingForeignKey)
    this.store = store
    this.originalRowId = originalRowId

    this.updateRowCommand = new UpdateRowCommand({
      mutationDataSource: deps.mutationDataSource,
      rowListRefreshService: deps.rowListRefreshService,
      projectContext: deps.projectContext,
      tableId: deps.tableId,
    })

    makeObservable<RowUpdatingItem, '_isLoading'>(this, {
      _isLoading: observable,
      isLoading: computed,
      canUpdateRow: computed,
      approve: action.bound,
      approveAndNavigate: action.bound,
      uploadFileWithNotification: action.bound,
      revert: action.bound,
    })
  }

  public get isLoading(): boolean {
    return this._isLoading
  }

  public get canUpdateRow(): boolean {
    return this.isEditableRevision && this.deps.permissionContext.canUpdateRow
  }

  public get currentRowId(): string {
    return this.store.name.getPlainValue()
  }

  public async approve(): Promise<boolean> {
    this._isLoading = true

    try {
      const result = await this.updateRowCommand.execute(this.store, this.originalRowId)

      if (result) {
        this.store.save()
        this.store.syncReadOnlyStores()
        return true
      }

      return false
    } finally {
      this._isLoading = false
    }
  }

  public async approveAndNavigate(): Promise<void> {
    const result = await this.approve()

    if (result) {
      this.deps.navigation.navigateToRow(this.currentRowId)
    }
  }

  public revert(): void {
    this.store.reset()
  }

  public async uploadFile(fileId: string, file: File): Promise<JsonValue | null> {
    const result = await this.deps.mutationDataSource.uploadFile({
      revisionId: this.deps.projectContext.branch.draft.id,
      tableId: this.tableId,
      rowId: this.store.name.getPlainValue(),
      fileId,
      file,
    })

    if (result) {
      if (!this.deps.projectContext.branch.touched) {
        this.deps.projectContext.updateTouched(true)
      }
      return result.row.data as JsonValue
    }

    return null
  }

  public async uploadFileWithNotification(fileId: string, file: File): Promise<void> {
    const toastId = this.deps.notifications.onUploadStart()

    const freshData = await this.uploadFile(fileId, file)

    if (freshData) {
      this.deps.notifications.onUploadSuccess(toastId)
      this.syncReadOnlyStores(freshData)
      this.deps.navigation.navigateToRow(this.currentRowId)
    } else {
      this.deps.notifications.onUploadError(toastId)
    }
  }

  public syncReadOnlyStores(freshData?: JsonValue): void {
    this.store.syncReadOnlyStores(freshData)
  }
}
