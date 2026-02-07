import { action, makeObservable } from 'mobx'
import type { CreatingEditorVM, UpdatingEditorVM } from '@revisium/schema-toolkit-ui'
import { TableStackItemBase, TableStackItemBaseDeps } from './TableStackItemBase.ts'

export abstract class TableEditorItemBase extends TableStackItemBase {
  public abstract readonly viewModel: CreatingEditorVM | UpdatingEditorVM

  protected constructor(deps: TableStackItemBaseDeps, isSelectingForeignKey: boolean) {
    super(deps, isSelectingForeignKey)

    makeObservable(this, {
      toList: action.bound,
      startForeignKeySelection: action.bound,
      cancelForeignKeySelection: action.bound,
    })
  }

  public toList(): void {
    this.resolve({ type: 'toList' })
  }

  public startForeignKeySelection(resolve: (tableId: string | null) => void): void {
    this.resolve({ type: 'startForeignKeySelection', resolve })
  }

  public cancelForeignKeySelection(): void {
    this.resolve({ type: 'cancelForeignKeySelection' })
  }
}
