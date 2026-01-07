import { action, computed, makeObservable } from 'mobx'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { RowListRefreshService } from 'src/widgets/RowList/model/RowListRefreshService.ts'
import { RowStackItemBase, RowStackItemBaseDeps } from './RowStackItemBase.ts'

export interface RowEditorItemBaseDeps extends RowStackItemBaseDeps {
  mutationDataSource: RowMutationDataSource
  rowListRefreshService: RowListRefreshService
}

export abstract class RowEditorItemBase extends RowStackItemBase {
  public abstract readonly store: RowDataCardStore

  protected constructor(
    protected override readonly deps: RowEditorItemBaseDeps,
    isSelectingForeignKey: boolean,
  ) {
    super(deps, isSelectingForeignKey)

    makeObservable(this, {
      isConnectingForeignKey: computed,
      toList: action.bound,
      startForeignKeySelection: action.bound,
      cancelForeignKeySelection: action.bound,
      setRowName: action.bound,
    })
  }

  public get isConnectingForeignKey(): boolean {
    return this.hasPendingRequest
  }

  public setRowName(value: string): void {
    this.store.name.setValue(value)
  }

  public getJsonString(): string {
    return JSON.stringify(this.store.root.getPlainValue(), null, 2)
  }

  public toList(): void {
    this.resolve({ type: 'toList' })
  }

  public startForeignKeySelection(foreignKeyNode: JsonStringValueStore, foreignTableId: string): void {
    this.resolve({ type: 'startForeignKeySelection', foreignKeyNode, foreignTableId })
  }

  public cancelForeignKeySelection(): void {
    this.resolve({ type: 'cancelForeignKeySelection' })
  }

  public override dispose(): void {
    this.deps.mutationDataSource.dispose()
  }
}
