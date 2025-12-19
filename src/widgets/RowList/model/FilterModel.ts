import { makeAutoObservable, observable } from 'mobx'
import { JsonSchema } from 'src/entities/Schema'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore'
import { SYSTEM_FIELDS_CONFIG } from '../config/systemFields'
import { extractFilterableFields } from '../lib/extractFilterableFields'
import { buildGraphQLWhere } from '../lib/filterGraphQLBuilder'
import {
  createEmptyCondition,
  createEmptyGroup,
  FilterableField,
  FilterCondition,
  FilterFieldType,
  FilterGroup,
  FilterOperator,
  getDefaultOperator,
  operatorRequiresValue,
  SearchLanguage,
  SearchType,
} from './filterTypes'

export class FilterModel {
  private _rootGroup: FilterGroup = createEmptyGroup('and')
  private _availableFields: FilterableField[] = []
  private _systemFields: FilterableField[] = []
  private _isFilterBarOpen = false
  private _onFilterChange: (() => void) | null = null
  private _appliedFilterSnapshot: string = ''
  private _appliedGroup: FilterGroup | null = null
  private _hasPendingChanges = false
  private _showValidationErrors = false
  private _validationErrors = observable.map<string, string>()

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get rootGroup(): FilterGroup {
    return this._rootGroup
  }

  public get availableFields(): FilterableField[] {
    return this._availableFields
  }

  public get systemFields(): FilterableField[] {
    return this._systemFields
  }

  public get allFields(): FilterableField[] {
    return [...this._availableFields, ...this._systemFields]
  }

  public getFilterableFieldForColumn(
    columnName: string,
    isSystemField?: boolean,
    systemFieldId?: string,
  ): FilterableField | undefined {
    if (isSystemField && systemFieldId) {
      return (
        this._systemFields.find((f) => f.systemFieldId === systemFieldId) ||
        this._availableFields.find((f) => f.systemFieldId === systemFieldId)
      )
    }
    return this._availableFields.find((f) => f.name === columnName)
  }

  public get isFilterBarOpen(): boolean {
    return this._isFilterBarOpen
  }

  public get filterCount(): number {
    return this.countFilters(this._rootGroup)
  }

  public get hasFilters(): boolean {
    return this.filterCount > 0
  }

  public get hasPendingChanges(): boolean {
    return this._hasPendingChanges
  }

  public get hasAppliedFilters(): boolean {
    if (!this._appliedGroup) return false
    return this._appliedGroup.conditions.length > 0 || this._appliedGroup.groups.length > 0
  }

  public get tooltipContent(): string {
    if (this.hasAppliedFilters) {
      return `Filters: ${this.filterCount} active`
    }
    return 'Filter'
  }

  public get showValidationErrors(): boolean {
    return this._showValidationErrors
  }

  public getErrorForCondition(conditionId: string): string | undefined {
    if (!this._showValidationErrors) return undefined
    return this._validationErrors.get(conditionId)
  }

  public setOnFilterChange(callback: () => void): void {
    this._onFilterChange = callback
  }

  public init(schema: JsonSchema): void {
    const schemaStore = createJsonSchemaStore(schema)
    const { dataFields, usedSystemFieldIds } = extractFilterableFields(schemaStore)
    this._availableFields = dataFields
    this._systemFields = SYSTEM_FIELDS_CONFIG.filter((config) => !usedSystemFieldIds.has(config.id)).map((config) => ({
      nodeId: config.id,
      name: config.name,
      path: [],
      fieldType: config.fieldType,
      isSystemField: true,
      systemFieldId: config.id,
    }))
    this._rootGroup = createEmptyGroup('and')
    this._isFilterBarOpen = false
    this._appliedFilterSnapshot = this.getEmptySnapshot()
    this._appliedGroup = null
    this._hasPendingChanges = false
    this._showValidationErrors = false
    this._validationErrors.clear()
  }

  public dispose(): void {
    this._availableFields = []
    this._rootGroup = createEmptyGroup('and')
    this._isFilterBarOpen = false
    this._appliedFilterSnapshot = ''
    this._appliedGroup = null
    this._hasPendingChanges = false
  }

  public reset(): void {
    this._rootGroup = createEmptyGroup('and')
    this._isFilterBarOpen = false
    this._hasPendingChanges = false
    this._appliedFilterSnapshot = this.getEmptySnapshot()
    this._appliedGroup = null
    this._showValidationErrors = false
    this._validationErrors.clear()
    this.notifyFilterChange()
  }

  public apply(): boolean {
    this._validationErrors.clear()
    this.validateGroup(this._rootGroup, this._validationErrors)

    if (this._validationErrors.size > 0) {
      this._showValidationErrors = true
      return false
    }

    this._showValidationErrors = false
    this._appliedFilterSnapshot = this.getCurrentSnapshot()
    this._appliedGroup = JSON.parse(this._appliedFilterSnapshot)
    this._hasPendingChanges = false
    this.notifyFilterChange()
    return true
  }

  public getConditionError(conditionId: string): string | undefined {
    const errors = new Map<string, string>()
    this.validateGroup(this._rootGroup, errors)
    return errors.get(conditionId)
  }

  private validateGroup(group: FilterGroup, errors: Map<string, string>): void {
    for (const condition of group.conditions) {
      const error = this.validateCondition(condition)
      if (error) {
        errors.set(condition.id, error)
      }
    }
    for (const subGroup of group.groups) {
      this.validateGroup(subGroup, errors)
    }
  }

  private validateCondition(condition: FilterCondition): string | null {
    if (operatorRequiresValue(condition.operator, condition.fieldType)) {
      if (condition.value === '' || condition.value === null || condition.value === undefined) {
        return 'Value is required'
      }

      if (condition.fieldType === FilterFieldType.Number && isNaN(Number(condition.value))) {
        return 'Invalid number'
      }
    }
    return null
  }

  public openFilterBar(): void {
    this._isFilterBarOpen = true
  }

  public closeFilterBar(): void {
    this._isFilterBarOpen = false
  }

  public toggleFilterBar(): void {
    this._isFilterBarOpen = !this._isFilterBarOpen
  }

  public addCondition(groupId: string, field?: FilterableField): void {
    const targetField = field ?? this._availableFields[0]
    if (!targetField) {
      return
    }

    const condition = createEmptyCondition(targetField)
    const group = this.findGroup(this._rootGroup, groupId)

    if (group) {
      group.conditions.push(condition)
      this.markAsPending()
    }
  }

  public addQuickFilter(
    field: FilterableField,
    operator: FilterOperator,
    value: string | number | boolean | null,
    searchLanguage?: SearchLanguage,
    searchType?: SearchType,
  ): boolean {
    if (operatorRequiresValue(operator, field.fieldType) && (value === '' || value === null)) {
      return false
    }

    this.addCondition(this._rootGroup.id, field)

    const conditions = this._rootGroup.conditions
    const lastCondition = conditions[conditions.length - 1]
    if (lastCondition) {
      this.updateCondition(lastCondition.id, {
        operator,
        value: operatorRequiresValue(operator, field.fieldType) ? value : null,
        searchLanguage,
        searchType,
      })
    }

    this.apply()
    return true
  }

  public updateCondition(conditionId: string, updates: Partial<FilterCondition>): void {
    const result = this.findConditionWithParent(this._rootGroup, conditionId)
    if (!result) return

    const { condition } = result
    const previousFieldType = condition.fieldType

    Object.assign(condition, updates)

    if (updates.fieldType && updates.fieldType !== previousFieldType) {
      condition.operator = getDefaultOperator(updates.fieldType)
      condition.value = this.getDefaultValue(updates.fieldType)
    }

    if (updates.operator && !operatorRequiresValue(updates.operator, condition.fieldType)) {
      condition.value = null
    }

    this.markAsPending()
  }

  private getDefaultValue(fieldType: FilterFieldType): string | number | boolean {
    switch (fieldType) {
      case FilterFieldType.Boolean:
        return true
      case FilterFieldType.Number:
        return 0
      default:
        return ''
    }
  }

  public removeCondition(conditionId: string): void {
    const removed = this.removeConditionFromGroup(this._rootGroup, conditionId)
    if (removed) {
      this.markAsPending()
    }
  }

  public addGroup(parentGroupId: string): void {
    const parentGroup = this.findGroup(this._rootGroup, parentGroupId)
    if (!parentGroup) return

    const newGroup = createEmptyGroup('and')

    if (this._availableFields.length > 0) {
      newGroup.conditions.push(createEmptyCondition(this._availableFields[0]))
    }

    parentGroup.groups.push(newGroup)
    this.markAsPending()
  }

  public removeGroup(groupId: string): void {
    if (groupId === this._rootGroup.id) {
      return
    }

    const removed = this.removeGroupFromParent(this._rootGroup, groupId)
    if (removed) {
      this.markAsPending()
    }
  }

  public setGroupLogic(groupId: string, logic: 'and' | 'or'): void {
    const group = this.findGroup(this._rootGroup, groupId)
    if (group) {
      group.logic = logic
      this.markAsPending()
    }
  }

  public toGraphQLWhere(): object | undefined {
    if (!this._appliedGroup) return undefined
    return buildGraphQLWhere(this._appliedGroup)
  }

  public get currentFiltersJson(): object | undefined {
    return buildGraphQLWhere(this._rootGroup)
  }

  private countFilters(group: FilterGroup): number {
    let count = group.conditions.length

    for (const subGroup of group.groups) {
      count += this.countFilters(subGroup)
    }

    return count
  }

  private findGroup(group: FilterGroup, groupId: string): FilterGroup | null {
    if (group.id === groupId) return group

    for (const subGroup of group.groups) {
      const found = this.findGroup(subGroup, groupId)
      if (found) return found
    }

    return null
  }

  private findConditionWithParent(
    group: FilterGroup,
    conditionId: string,
  ): { condition: FilterCondition; parent: FilterGroup } | null {
    const condition = group.conditions.find((c) => c.id === conditionId)
    if (condition) return { condition, parent: group }

    for (const subGroup of group.groups) {
      const found = this.findConditionWithParent(subGroup, conditionId)
      if (found) return found
    }

    return null
  }

  private removeConditionFromGroup(group: FilterGroup, conditionId: string): boolean {
    const index = group.conditions.findIndex((c) => c.id === conditionId)
    if (index !== -1) {
      group.conditions.splice(index, 1)
      return true
    }

    for (const subGroup of group.groups) {
      if (this.removeConditionFromGroup(subGroup, conditionId)) {
        return true
      }
    }

    return false
  }

  private removeGroupFromParent(parent: FilterGroup, groupId: string): boolean {
    const index = parent.groups.findIndex((g) => g.id === groupId)
    if (index !== -1) {
      parent.groups.splice(index, 1)
      return true
    }

    for (const subGroup of parent.groups) {
      if (this.removeGroupFromParent(subGroup, groupId)) {
        return true
      }
    }

    return false
  }

  private markAsPending(): void {
    const currentSnapshot = this.getCurrentSnapshot()
    this._hasPendingChanges = currentSnapshot !== this._appliedFilterSnapshot
  }

  private getCurrentSnapshot(): string {
    return JSON.stringify(this._rootGroup)
  }

  private getEmptySnapshot(): string {
    return JSON.stringify(createEmptyGroup('and'))
  }

  private notifyFilterChange(): void {
    if (this._onFilterChange) {
      this._onFilterChange()
    }
  }
}
