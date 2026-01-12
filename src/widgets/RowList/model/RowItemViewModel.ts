import { makeAutoObservable } from 'mobx'
import { RowListItemFragment } from 'src/__generated__/graphql-request'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { CellViewModel } from './CellViewModel'
import { SystemFieldId } from './filterTypes'
import { InlineEditModel } from './InlineEditModel'

interface RowItemViewModelParams {
  item: RowListItemFragment
  cellsMap: Map<string, JsonValueStore>
  isEdit: boolean
  projectPermissions: ProjectPermissions
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

  public getSystemFieldValue(systemFieldId: SystemFieldId): string | null {
    switch (systemFieldId) {
      case SystemFieldId.Id:
        return this.params.item.id
      case SystemFieldId.CreatedAt:
        return this.params.item.createdAt
      case SystemFieldId.UpdatedAt:
        return this.params.item.updatedAt
      case SystemFieldId.PublishedAt:
        return this.params.item.publishedAt
      case SystemFieldId.VersionId:
        return this.params.item.versionId
      case SystemFieldId.CreatedId:
        return this.params.item.createdId
      default:
        return null
    }
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

  public get data(): JsonValue {
    return this.params.item.data as JsonValue
  }

  public get cellsMap(): Map<string, JsonValueStore> {
    return this.params.cellsMap
  }

  public get isEdit(): boolean {
    return this.params.isEdit
  }

  public get canCreateRow(): boolean {
    return this.params.isEdit && this.params.projectPermissions.canCreateRow
  }

  public get canDeleteRow(): boolean {
    return this.params.isEdit && this.params.projectPermissions.canDeleteRow
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
