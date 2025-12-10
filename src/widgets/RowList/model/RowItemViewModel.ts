import { makeAutoObservable } from 'mobx'
import { RowListItemFragment } from 'src/__generated__/graphql-request'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { CellViewModel } from './CellViewModel'
import { InlineEditModel } from './InlineEditModel'

interface RowItemViewModelParams {
  item: RowListItemFragment
  cellsMap: Map<string, JsonValueStore>
  isEdit: boolean
  permissionContext: PermissionContext
  inlineEditModel: InlineEditModel
  onDelete: (rowId: string) => Promise<boolean>
}

export class RowItemViewModel {
  private readonly _cellViewModels = new Map<string, CellViewModel>()

  constructor(private readonly params: RowItemViewModelParams) {
    makeAutoObservable<RowItemViewModel, '_cellViewModels'>(this, { _cellViewModels: false }, { autoBind: true })
  }

  public getCellViewModel(columnId: string): CellViewModel | undefined {
    const store = this.params.cellsMap.get(columnId)
    if (!store) {
      return undefined
    }

    let cellVM = this._cellViewModels.get(columnId)
    if (!cellVM) {
      cellVM = new CellViewModel(this.id, columnId, store, this.params.inlineEditModel, !this.params.isEdit)
      this._cellViewModels.set(columnId, cellVM)
    }
    return cellVM
  }

  public get id(): string {
    return this.params.item.id
  }

  public get versionId(): string {
    return this.params.item.versionId
  }

  public get readonly(): boolean {
    return this.params.item.readonly
  }

  public get cellsMap(): Map<string, JsonValueStore> {
    return this.params.cellsMap
  }

  public get isEdit(): boolean {
    return this.params.isEdit
  }

  public get canCreateRow(): boolean {
    return this.params.isEdit && this.params.permissionContext.canCreateRow
  }

  public get canDeleteRow(): boolean {
    return this.params.isEdit && this.params.permissionContext.canDeleteRow
  }

  public get showMenu(): boolean {
    return this.canCreateRow || this.canDeleteRow
  }

  public get showModifiedIndicator(): boolean {
    return !this.readonly && this.params.isEdit
  }

  public get isRowEditing(): boolean {
    return this.params.inlineEditModel.isRowEditing(this.id)
  }

  public async delete(): Promise<boolean> {
    return this.params.onDelete(this.id)
  }
}
