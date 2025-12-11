import { makeAutoObservable } from 'mobx'
import { OrderBy, OrderByField, OrderDataType, SortOrder } from 'src/__generated__/graphql-request'
import { FilterFieldType } from './filterTypes'
import { SortConfig, SortDirection, SortableField } from '../config/sortTypes'

export class SortModel {
  private _sorts: SortConfig[] = []
  private _availableFields: SortableField[] = []
  private _onSortChange: (() => void) | null = null
  private _isOpen = false
  private _appliedSortSnapshot: string = '[]'
  private _appliedSorts: SortConfig[] = []
  private _hasPendingChanges = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get sorts(): SortConfig[] {
    return this._sorts
  }

  public get sortCount(): number {
    return this._sorts.length
  }

  public get hasSorts(): boolean {
    return this._sorts.length > 0
  }

  public get availableFields(): SortableField[] {
    return this._availableFields
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get hasPendingChanges(): boolean {
    return this._hasPendingChanges
  }

  public get hasAppliedSorts(): boolean {
    return this._appliedSorts.length > 0
  }

  public get tooltipContent(): string {
    if (this.hasAppliedSorts) {
      return `Sort: ${this.sortCount} active`
    }
    return 'Sort'
  }

  public setOnSortChange(callback: () => void): void {
    this._onSortChange = callback
  }

  public init(availableFields: SortableField[]): void {
    this._availableFields = this.sortFieldsByPriority(availableFields)
    this._sorts = []
    this._isOpen = false
    this._appliedSortSnapshot = '[]'
    this._appliedSorts = []
    this._hasPendingChanges = false
  }

  private sortFieldsByPriority(fields: SortableField[]): SortableField[] {
    const typePriority: Record<FilterFieldType, number> = {
      [FilterFieldType.String]: 1,
      [FilterFieldType.Boolean]: 2,
      [FilterFieldType.Number]: 3,
      [FilterFieldType.ForeignKey]: 4,
      [FilterFieldType.File]: 5,
    }

    return [...fields].sort((a, b) => {
      const levelDiff = a.path.length - b.path.length
      if (levelDiff !== 0) return levelDiff

      const typeDiff = typePriority[a.fieldType] - typePriority[b.fieldType]
      if (typeDiff !== 0) return typeDiff

      return a.name.localeCompare(b.name)
    })
  }

  public dispose(): void {
    this._availableFields = []
    this._sorts = []
    this._isOpen = false
    this._appliedSortSnapshot = '[]'
    this._appliedSorts = []
    this._hasPendingChanges = false
  }

  public open(): void {
    this._isOpen = true
  }

  public close(): void {
    this._isOpen = false
  }

  public toggle(): void {
    this._isOpen = !this._isOpen
  }

  public getSortForField(nodeId: string): SortConfig | undefined {
    return this._sorts.find((s) => s.id === nodeId)
  }

  public getSortIndex(nodeId: string): number | undefined {
    const index = this._sorts.findIndex((s) => s.id === nodeId)
    return index >= 0 ? index + 1 : undefined
  }

  public isSorted(nodeId: string): boolean {
    return this._sorts.some((s) => s.id === nodeId)
  }

  public getSortDirection(nodeId: string): SortDirection | undefined {
    return this.getSortForField(nodeId)?.direction
  }

  public setSort(nodeId: string, direction: SortDirection): void {
    const field = this._availableFields.find((f) => f.nodeId === nodeId)
    if (!field) return

    const existingIndex = this._sorts.findIndex((s) => s.id === nodeId)

    if (existingIndex >= 0) {
      this._sorts[existingIndex].direction = direction
    } else {
      this._sorts.push({
        id: nodeId,
        field: field.name,
        fieldPath: field.path,
        fieldType: field.fieldType,
        direction,
      })
    }

    this.markAsPending()
  }

  public removeSort(nodeId: string): void {
    const index = this._sorts.findIndex((s) => s.id === nodeId)
    if (index >= 0) {
      this._sorts.splice(index, 1)
      this.markAsPending()
    }
  }

  public replaceField(oldNodeId: string, newNodeId: string): void {
    const field = this._availableFields.find((f) => f.nodeId === newNodeId)
    if (!field) return

    const existingIndex = this._sorts.findIndex((s) => s.id === oldNodeId)
    if (existingIndex < 0) return

    const alreadyExists = this._sorts.some((s) => s.id === newNodeId)
    if (alreadyExists) {
      this._sorts.splice(existingIndex, 1)
    } else {
      this._sorts[existingIndex] = {
        id: newNodeId,
        field: field.name,
        fieldPath: field.path,
        fieldType: field.fieldType,
        direction: this._sorts[existingIndex].direction,
      }
    }
    this.markAsPending()
  }

  public addSort(nodeId: string): void {
    if (this.isSorted(nodeId)) return
    this.setSort(nodeId, 'asc')
  }

  public setSortAndApply(nodeId: string, direction: SortDirection): void {
    this.setSort(nodeId, direction)
    this.apply()
  }

  public removeSortAndApply(nodeId: string): void {
    this.removeSort(nodeId)
    this.apply()
  }

  public get fieldsNotInSort(): SortableField[] {
    const sortedIds = new Set(this._sorts.map((s) => s.id))
    return this._availableFields.filter((f) => !sortedIds.has(f.nodeId))
  }

  public get canAddSort(): boolean {
    return this.fieldsNotInSort.length > 0
  }

  public clearAll(): void {
    if (this._sorts.length > 0) {
      this._sorts = []
      this.markAsPending()
    }
  }

  public apply(): void {
    this._appliedSortSnapshot = JSON.stringify(this._sorts)
    this._appliedSorts = JSON.parse(this._appliedSortSnapshot)
    this._hasPendingChanges = false
    this.notifySortChange()
  }

  public reset(): void {
    this._sorts = []
    this._appliedSortSnapshot = '[]'
    this._appliedSorts = []
    this._hasPendingChanges = false
    this.notifySortChange()
  }

  public toGraphQLOrderBy(): OrderBy[] | undefined {
    if (this._appliedSorts.length === 0) {
      return undefined
    }

    return this._appliedSorts.map((sort) => ({
      field: OrderByField.Data,
      path: this.buildSortPath(sort),
      direction: sort.direction === 'asc' ? SortOrder.Asc : SortOrder.Desc,
      type: this.mapFieldTypeToOrderDataType(sort.fieldType),
    }))
  }

  private buildSortPath(sort: SortConfig): string {
    const basePath = sort.fieldPath.length > 0 ? sort.fieldPath.join('.') : sort.field
    if (sort.fieldType === FilterFieldType.File) {
      return basePath ? `${basePath}.fileName` : 'fileName'
    }
    return basePath
  }

  private mapFieldTypeToOrderDataType(fieldType: FilterFieldType): OrderDataType {
    switch (fieldType) {
      case FilterFieldType.String:
      case FilterFieldType.ForeignKey:
      case FilterFieldType.File:
        return OrderDataType.Text
      case FilterFieldType.Number:
        return OrderDataType.Float
      case FilterFieldType.Boolean:
        return OrderDataType.Boolean
    }
  }

  private markAsPending(): void {
    const currentSnapshot = JSON.stringify(this._sorts)
    this._hasPendingChanges = currentSnapshot !== this._appliedSortSnapshot
  }

  private notifySortChange(): void {
    if (this._onSortChange) {
      this._onSortChange()
    }
  }
}
