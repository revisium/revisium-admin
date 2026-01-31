import { makeAutoObservable } from 'mobx'
import { type RowModel } from '@revisium/schema-toolkit-ui'
import { RowListItemFragment } from 'src/__generated__/graphql-request'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { CellViewModel } from './CellViewModel'
import { SystemFieldId } from './filterTypes'
import { InlineEditModel } from './InlineEditModel'

interface RowItemViewModelParams {
  item: RowListItemFragment
  rowModel: RowModel
  getPathForColumn: (columnId: string) => string | undefined
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
    const path = this.params.getPathForColumn(columnId)
    if (path === undefined) {
      return undefined
    }

    const node = this.params.rowModel.get(path)
    if (!node) {
      return undefined
    }

    let cellVM = this._cellViewModels.get(columnId)
    if (!cellVM) {
      cellVM = new CellViewModel(this.id, columnId, node, this.params.inlineEditModel, !this.params.isEdit)
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

  public get rowModel(): RowModel {
    return this.params.rowModel
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
