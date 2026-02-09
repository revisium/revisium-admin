import { action, computed, makeObservable, observable } from 'mobx'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { UpdateRowCommand } from '../commands'
import { RowStackItemType } from '../../config/types.ts'
import { RowEditorState } from '../RowEditorState.ts'
import { RowEditorItemBase, RowEditorItemBaseDeps } from './RowEditorItemBase.ts'

export type RowUpdatingItemDeps = RowEditorItemBaseDeps

export class RowUpdatingItem extends RowEditorItemBase {
  public readonly type = RowStackItemType.Updating
  public readonly state: RowEditorState
  public readonly originalRowId: string

  private _isLoading = false

  private readonly updateRowCommand: UpdateRowCommand

  constructor(deps: RowUpdatingItemDeps, isSelectingForeignKey: boolean, state: RowEditorState, originalRowId: string) {
    super(deps, isSelectingForeignKey)
    this.state = state
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
    return this.isEditableRevision && this.deps.projectPermissions.canUpdateRow
  }

  public get currentRowId(): string {
    return this.state.editor.rowId
  }

  public async approve(): Promise<boolean> {
    this._isLoading = true

    try {
      const result = await this.updateRowCommand.execute({
        currentRowId: this.state.editor.rowId,
        originalRowId: this.originalRowId,
        data: this.state.editor.getValue() as JsonValue,
        isRowIdChanged: this.state.editor.isRowIdChanged,
        isDirty: this.state.editor.isDirty,
      })

      if (result) {
        this.state.editor.markAsSaved()
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
      this.deps.navigation.navigateToRow(this.tableId, this.currentRowId)
    }
  }

  public revert(): void {
    this.state.editor.revert()
  }

  public async uploadFile(fileId: string, file: File): Promise<JsonValue | null> {
    const result = await this.deps.mutationDataSource.uploadFile({
      revisionId: this.deps.projectContext.revisionId,
      tableId: this.tableId,
      rowId: this.state.editor.rowId,
      fileId,
      file,
    })

    if (result) {
      if (!this.deps.projectContext.touched) {
        this.deps.projectContext.updateTouched(true)
      }
      return result.row.data as JsonValue
    }

    return null
  }

  public async uploadFileWithNotification(fileId: string, file: File): Promise<Record<string, unknown> | null> {
    const toastId = this.deps.notifications.onUploadStart()

    const freshRowData = await this.uploadFile(fileId, file)

    if (freshRowData) {
      this.deps.notifications.onUploadSuccess(toastId)
      return this.extractFileFieldData(fileId, freshRowData)
    }

    this.deps.notifications.onUploadError(toastId)
    return null
  }

  private extractFileFieldData(fileId: string, rowData: JsonValue): Record<string, unknown> | null {
    if (typeof rowData !== 'object' || rowData === null || Array.isArray(rowData)) {
      return null
    }

    for (const value of Object.values(rowData as Record<string, unknown>)) {
      if (typeof value === 'object' && value !== null && (value as Record<string, unknown>).fileId === fileId) {
        return value as Record<string, unknown>
      }
    }

    return null
  }
}
