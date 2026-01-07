import { action, computed, makeObservable } from 'mobx'
import { TableStackItemType } from '../../config/types.ts'
import { TableStackItemBase, TableStackItemBaseDeps } from './TableStackItemBase.ts'

export class TableListItem extends TableStackItemBase {
  public readonly type = TableStackItemType.List

  constructor(deps: TableStackItemBaseDeps, isSelectingForeignKey: boolean) {
    super(deps, isSelectingForeignKey)

    makeObservable(this, {
      canCreateTable: computed,
      toCreating: action.bound,
      toCloning: action.bound,
      toUpdating: action.bound,
      selectTable: action.bound,
    })
  }

  public get canCreateTable(): boolean {
    return this.isEditableRevision && this.deps.permissionContext.canCreateTable
  }

  public toCreating(): void {
    this.resolve({ type: 'toCreating' })
  }

  public toCloning(tableId: string): void {
    this.resolve({ type: 'toCloning', tableId })
  }

  public toUpdating(tableId: string): void {
    this.resolve({ type: 'toUpdating', tableId })
  }

  public selectTable(tableId: string): void {
    this.resolve({ type: 'selectTable', tableId })
  }
}
