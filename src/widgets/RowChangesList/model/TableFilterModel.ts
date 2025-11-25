import { makeAutoObservable } from 'mobx'
import { GetTableChangesForFilterQuery } from 'src/__generated__/graphql-request'

type TableForFilter = GetTableChangesForFilterQuery['tableChanges']['edges'][number]['node']

export class TableFilterModel {
  private _selectedTableId: string | null = null
  private _isOpen = false
  private _tables: TableForFilter[] = []

  constructor(
    private onTableChange: (tableId: string | null) => void,
    initialTableId: string | null = null,
  ) {
    this._selectedTableId = initialTableId
    makeAutoObservable(this)
  }

  public get selectedTableId(): string | null {
    return this._selectedTableId
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get tables(): TableForFilter[] {
    return this._tables
  }

  public get sortedTables(): TableForFilter[] {
    return [...this._tables].sort((a, b) => {
      const nameA = a.newTableId || a.tableId
      const nameB = b.newTableId || b.tableId
      return nameA.localeCompare(nameB)
    })
  }

  public get selectedTable(): TableForFilter | null {
    if (!this._selectedTableId) return null
    return this._tables.find((t) => (t.newTableId || t.tableId) === this._selectedTableId) ?? null
  }

  public get displayName(): string {
    if (!this.selectedTable) return 'All tables'
    return this.selectedTable.newTableId || this.selectedTable.tableId
  }

  public get hasSelection(): boolean {
    return this._selectedTableId !== null
  }

  public setTables(tables: TableForFilter[]): void {
    this._tables = tables
  }

  public setIsOpen(open: boolean): void {
    this._isOpen = open
  }

  public select(tableId: string | null): void {
    this._selectedTableId = tableId
    this._isOpen = false
    this.onTableChange(tableId)
  }

  public clear(): void {
    this._selectedTableId = null
    this.onTableChange(null)
  }

  public setInitialTableId(tableId: string | null): void {
    this._selectedTableId = tableId
  }

  public getTableDisplayName(table: TableForFilter): string {
    return table.newTableId || table.tableId
  }

  public isSelected(table: TableForFilter): boolean {
    return this._selectedTableId === this.getTableDisplayName(table)
  }
}
