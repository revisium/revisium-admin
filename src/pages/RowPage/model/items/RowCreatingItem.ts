import { action, computed, makeObservable, observable } from 'mobx'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { CreateRowCommand } from '../commands'
import { RowStackItemType } from '../../config/types.ts'
import { RowEditorItemBase, RowEditorItemBaseDeps } from './RowEditorItemBase.ts'

export type RowCreatingItemDeps = RowEditorItemBaseDeps

export class RowCreatingItem extends RowEditorItemBase {
  public readonly type = RowStackItemType.Creating
  public readonly store: RowDataCardStore

  private _isLoading = false

  private readonly createRowCommand: CreateRowCommand

  constructor(deps: RowCreatingItemDeps, isSelectingForeignKey: boolean, store: RowDataCardStore) {
    super(deps, isSelectingForeignKey)
    this.store = store

    this.createRowCommand = new CreateRowCommand({
      mutationDataSource: deps.mutationDataSource,
      rowListRefreshService: deps.rowListRefreshService,
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
    return this.store.name.getPlainValue()
  }

  public async approve(): Promise<string | null> {
    const rowId = this.store.name.getPlainValue()
    const data = this.store.root.getPlainValue()

    this._isLoading = true

    try {
      const result = await this.createRowCommand.execute(rowId, data)

      if (result) {
        this.store.save()
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
