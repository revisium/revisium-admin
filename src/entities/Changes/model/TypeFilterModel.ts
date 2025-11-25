import { makeAutoObservable } from 'mobx'
import { ChangeType } from 'src/__generated__/graphql-request'
import { changeTypeLabels, filterableChangeTypes } from '../lib'

export class TypeFilterModel {
  private _selectedTypes: ChangeType[] = []
  private _isOpen = false

  constructor(
    private onTypesChange: (types: ChangeType[]) => void,
    initialTypes: ChangeType[] = [],
  ) {
    this._selectedTypes = initialTypes
    makeAutoObservable(this)
  }

  public get selectedTypes(): ChangeType[] {
    return this._selectedTypes
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get hasSelection(): boolean {
    return this._selectedTypes.length > 0
  }

  public get displayText(): string {
    return this.hasSelection ? `Type (${this._selectedTypes.length})` : 'Type'
  }

  public get filterableTypes(): ChangeType[] {
    return filterableChangeTypes
  }

  public getLabel(type: ChangeType): string {
    return changeTypeLabels[type]
  }

  public isChecked(type: ChangeType): boolean {
    return this._selectedTypes.includes(type)
  }

  public setIsOpen(open: boolean): void {
    this._isOpen = open
  }

  public toggleType(type: ChangeType): void {
    const isSelected = this._selectedTypes.includes(type)
    if (isSelected) {
      this._selectedTypes = this._selectedTypes.filter((t) => t !== type)
    } else {
      this._selectedTypes = [...this._selectedTypes, type]
    }
    this.onTypesChange(this._selectedTypes)
  }

  public clear(): void {
    this._selectedTypes = []
    this.onTypesChange(this._selectedTypes)
  }

  public setSelectedTypes(types: ChangeType[]): void {
    this._selectedTypes = types
  }
}
