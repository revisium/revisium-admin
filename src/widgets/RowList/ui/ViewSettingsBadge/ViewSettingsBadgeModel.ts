import { makeAutoObservable } from 'mobx'
import { RowListViewModel } from 'src/widgets/RowList/model/RowListViewModel'

export class ViewSettingsBadgeModel {
  private _isOpen = false

  constructor(private readonly rowListModel: RowListViewModel) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isVisible(): boolean {
    return this.rowListModel.hasPendingViewChanges
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get isDraft(): boolean {
    return this.rowListModel.isDraftRevision
  }

  public get isSaving(): boolean {
    return this.rowListModel.isSavingViews
  }

  public get tooltipText(): string {
    return this.isDraft ? 'Unsaved view changes' : 'Local view changes'
  }

  public get badgeText(): string {
    return this.isDraft ? 'unsaved' : 'local'
  }

  public get badgeColor(): string {
    return this.isDraft ? 'orange' : 'gray'
  }

  public get dotColor(): string {
    return this.isDraft ? 'orange.500' : 'newGray.400'
  }

  public get title(): string {
    return this.isDraft ? 'Unsaved view settings' : 'Local view changes'
  }

  public get description(): string {
    return this.isDraft
      ? 'Column order, widths, and sort settings will be saved to the Default view and shared with everyone.'
      : 'View settings can only be saved in draft revisions. These changes are temporary and will be lost when you leave.'
  }

  public get revertButtonText(): string {
    return this.isDraft ? 'Revert' : 'Reset'
  }

  public get isRevertDisabled(): boolean {
    return this.isDraft && this.isSaving
  }

  public get isSaveDisabled(): boolean {
    return this.isSaving
  }

  public get showSaveButton(): boolean {
    return this.isDraft
  }

  public setOpen(open: boolean): void {
    this._isOpen = open
  }

  public async save(): Promise<boolean> {
    const success = await this.rowListModel.saveViewSettings()
    if (success) {
      this._isOpen = false
    }
    return success
  }

  public revert(): void {
    this.rowListModel.revertViewSettings()
    this._isOpen = false
  }
}
