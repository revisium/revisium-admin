import { action, computed, makeObservable } from 'mobx'
import { RowStackItemType } from '../../config/types.ts'
import { RowStackItemBase, RowStackItemBaseDeps } from './RowStackItemBase.ts'

export class RowListItem extends RowStackItemBase {
  public readonly type = RowStackItemType.List

  constructor(deps: RowStackItemBaseDeps, isSelectingForeignKey: boolean) {
    super(deps, isSelectingForeignKey)

    makeObservable(this, {
      canCreateRow: computed,
      toCreating: action.bound,
      toCloning: action.bound,
      toUpdating: action.bound,
      selectRow: action.bound,
    })
  }

  public get canCreateRow(): boolean {
    return this.isEditableRevision && this.deps.permissionContext.canCreateRow
  }

  public toCreating(): void {
    this.resolve({ type: 'toCreating' })
  }

  public toCloning(rowId: string): void {
    this.resolve({ type: 'toCloning', rowId })
  }

  public toUpdating(rowId: string): void {
    this.resolve({ type: 'toUpdating', rowId })
  }

  public selectRow(rowId: string): void {
    this.resolve({ type: 'selectRow', rowId })
  }
}
