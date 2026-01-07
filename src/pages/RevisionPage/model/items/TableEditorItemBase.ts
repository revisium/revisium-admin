import { action, makeObservable } from 'mobx'
import { RootNodeStore } from 'src/widgets/SchemaEditor/model/RootNodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor/model/StringForeignKeyNodeStore.ts'
import { TableStackItemBase, TableStackItemBaseDeps } from './TableStackItemBase.ts'

export abstract class TableEditorItemBase extends TableStackItemBase {
  public abstract readonly store: RootNodeStore

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

  public startForeignKeySelection(foreignKeyNode: StringForeignKeyNodeStore): void {
    this.resolve({ type: 'startForeignKeySelection', foreignKeyNode })
  }

  public cancelForeignKeySelection(): void {
    this.resolve({ type: 'cancelForeignKeySelection' })
  }
}
