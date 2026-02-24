import { action, computed, makeObservable, observable } from 'mobx'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { CreateRowCommand } from '../commands'
import { RowStackItemType } from '../../config/types.ts'
import { RowEditorState } from '../RowEditorState.ts'
import { RowEditorItemBase, RowEditorItemBaseDeps } from './RowEditorItemBase.ts'

export type RowCreatingItemDeps = RowEditorItemBaseDeps

export class RowCreatingItem extends RowEditorItemBase {
  public readonly type = RowStackItemType.Creating
  public readonly state: RowEditorState

  private _isLoading = false

  private readonly createRowCommand: CreateRowCommand

  constructor(deps: RowCreatingItemDeps, isSelectingForeignKey: boolean, state: RowEditorState) {
    super(deps, isSelectingForeignKey)
    this.state = state

    this.createRowCommand = new CreateRowCommand({
      mutationDataSource: deps.mutationDataSource,
      projectContext: deps.projectContext,
      tableId: deps.tableId,
    })

    makeObservable<RowCreatingItem, '_isLoading'>(this, {
      _isLoading: observable,
      isLoading: computed,
      approve: action.bound,
      approveAndNavigate: action.bound,
      toUpdating: action.bound,
      selectForeignKeyRow: action.bound,
    })
  }

  public get isLoading(): boolean {
    return this._isLoading
  }

  public get rowId(): string {
    return this.state.editor.rowId
  }

  public async approve(): Promise<string | null> {
    const rowId = this.state.editor.rowId
    const data = this.state.editor.getValue() as JsonValue

    this._isLoading = true

    try {
      const result = await this.createRowCommand.execute(rowId, data)

      if (result) {
        this.state.editor.markAsSaved()
        if (this.isSelectingForeignKey) {
          this.selectForeignKeyRow(rowId)
        } else {
          this.toUpdating()
        }
        return rowId
      }

      return null
    } finally {
      this._isLoading = false
    }
  }

  public async approveAndNavigate(): Promise<void> {
    const createdRowId = await this.approve()

    if (createdRowId && !this.isSelectingForeignKey) {
      this.deps.navigation.navigateToRow(this.tableId, createdRowId)
    }
  }

  public toUpdating(): void {
    this.resolve({ type: 'creatingToUpdating' })
  }

  public selectForeignKeyRow(rowId: string): void {
    this.resolve({ type: 'selectForeignKeyRow', rowId })
  }
}
