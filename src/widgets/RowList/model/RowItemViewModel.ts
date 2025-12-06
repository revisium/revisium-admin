import { makeAutoObservable } from 'mobx'
import { RowListItemFragment } from 'src/__generated__/graphql-request'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { PermissionContext } from 'src/shared/model/AbilityService'

interface RowItemViewModelParams {
  item: RowListItemFragment
  cellsMap: Map<string, JsonValueStore>
  isEdit: boolean
  permissionContext: PermissionContext
  onDelete: (rowId: string) => Promise<boolean>
}

export class RowItemViewModel {
  constructor(private readonly params: RowItemViewModelParams) {
    makeAutoObservable(this, {}, { autoBind: true })
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

  public async delete(): Promise<boolean> {
    return this.params.onDelete(this.id)
  }
}
