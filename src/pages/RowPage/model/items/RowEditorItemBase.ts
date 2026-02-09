import { action, computed, makeObservable } from 'mobx'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { RowListRefreshService } from 'src/widgets/RowList/model/RowListRefreshService.ts'
import { RowEditorNavigation, RowEditorNotifications, SelectForeignKeyRowPayload } from '../../config/types.ts'
import { RowEditorState } from '../RowEditorState.ts'
import { RowStackItemBase, RowStackItemBaseDeps } from './RowStackItemBase.ts'

export interface RowEditorItemBaseDeps extends RowStackItemBaseDeps {
  mutationDataSource: RowMutationDataSource
  rowListRefreshService: RowListRefreshService
  notifications: RowEditorNotifications
  navigation: RowEditorNavigation
}

export abstract class RowEditorItemBase extends RowStackItemBase {
  public abstract readonly state: RowEditorState

  protected constructor(
    protected override readonly deps: RowEditorItemBaseDeps,
    isSelectingForeignKey: boolean,
  ) {
    super(deps, isSelectingForeignKey)

    makeObservable(this, {
      isConnectingForeignKey: computed,
      pendingForeignKeyPath: computed,
      toList: action.bound,
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
    return payload.foreignTableId
  }

  public setRowName(value: string): void {
    this.state.editor.setRowId(value)
  }

  public getJsonString(): string {
    return JSON.stringify(this.state.editor.getValue(), null, 2)
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

  public startForeignKeySelection(foreignTableId: string): void {
    this.resolve({ type: 'startForeignKeySelection', foreignTableId })
  }

  public startForeignKeyCreation(foreignTableId: string): void {
    this.resolve({ type: 'startForeignKeyCreation', foreignTableId })
  }

  public cancelForeignKeySelection(): void {
    this.resolve({ type: 'cancelForeignKeySelection' })
  }

  public override dispose(): void {
    this.state.dispose()
    this.deps.mutationDataSource.dispose()
  }
}
