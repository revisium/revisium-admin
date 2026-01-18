import { action, computed, makeObservable } from 'mobx'
import { createJsonValuePathByStore } from 'src/entities/Schema/lib/createJsonValuePathByStore.ts'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { RowListRefreshService } from 'src/widgets/RowList/model/RowListRefreshService.ts'
import { RowEditorNavigation, RowEditorNotifications, SelectForeignKeyRowPayload } from '../../config/types.ts'
import { RowStackItemBase, RowStackItemBaseDeps } from './RowStackItemBase.ts'

export interface RowEditorItemBaseDeps extends RowStackItemBaseDeps {
  mutationDataSource: RowMutationDataSource
  rowListRefreshService: RowListRefreshService
  notifications: RowEditorNotifications
  navigation: RowEditorNavigation
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
      pendingForeignKeyPath: computed,
      toList: action.bound,
      handleSelectForeignKey: action.bound,
      handleCreateAndConnectForeignKey: action.bound,
      startForeignKeySelection: action.bound,
      startForeignKeyCreation: action.bound,
      cancelForeignKeySelection: action.bound,
      setRowName: action.bound,
    })
  }

  public get isConnectingForeignKey(): boolean {
    return this.hasPendingRequest
  }

  public get pendingForeignKeyPath(): string {
    const request = this.pendingRequest
    if (!request) {
      return ''
    }
    const payload = request.payload as SelectForeignKeyRowPayload
    return createJsonValuePathByStore(payload.foreignKeyNode)
  }

  public setRowName(value: string): void {
    this.store.name.setValue(value)
  }

  public getJsonString(): string {
    return JSON.stringify(this.store.root.getPlainValue(), null, 2)
  }

  public async copyJsonToClipboard(): Promise<void> {
    try {
      const json = this.getJsonString()
      await navigator.clipboard.writeText(json)
      this.deps.notifications.onCopySuccess()
    } catch {
      this.deps.notifications.onCopyError()
    }
  }

  public toList(): void {
    this.resolve({ type: 'toList' })
  }

  public handleSelectForeignKey(foreignKeyNode: JsonStringValueStore): void {
    const foreignTableId = foreignKeyNode.foreignKey
    if (foreignTableId) {
      this.startForeignKeySelection(foreignKeyNode, foreignTableId)
    }
  }

  public handleCreateAndConnectForeignKey(foreignKeyNode: JsonStringValueStore): void {
    const foreignTableId = foreignKeyNode.foreignKey
    if (foreignTableId) {
      this.startForeignKeyCreation(foreignKeyNode, foreignTableId)
    }
  }

  public startForeignKeySelection(foreignKeyNode: JsonStringValueStore, foreignTableId: string): void {
    this.resolve({ type: 'startForeignKeySelection', foreignKeyNode, foreignTableId })
  }

  public startForeignKeyCreation(foreignKeyNode: JsonStringValueStore, foreignTableId: string): void {
    this.resolve({ type: 'startForeignKeyCreation', foreignKeyNode, foreignTableId })
  }

  public cancelForeignKeySelection(): void {
    this.resolve({ type: 'cancelForeignKeySelection' })
  }

  public override dispose(): void {
    this.store.dispose()
    this.deps.mutationDataSource.dispose()
  }
}
