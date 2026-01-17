import { makeAutoObservable, runInAction } from 'mobx'
import { validateFormulaSyntax } from '@revisium/formula'
import type {
  FormulaTargetType,
  SchemaPath,
  FormulaCompletionItem,
  TooltipData,
} from 'src/widgets/SchemaEditor/lib/formula'
import {
  extractSchemaPaths,
  getFormulaCompletions,
  getTooltipDataAtPosition,
} from 'src/widgets/SchemaEditor/lib/formula'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore'
import { NumberNodeStore } from 'src/widgets/SchemaEditor/model/NumberNodeStore'
import { BooleanNodeStore } from 'src/widgets/SchemaEditor/model/BooleanNodeStore'

export type FormulaNode = StringNodeStore | NumberNodeStore | BooleanNodeStore

export class FormulaEditorViewModel {
  private _value = ''
  private _validationError: string | null = null
  private _isValidating = false
  private _completionItems: FormulaCompletionItem[] = []
  private _showCompletions = false
  private _cursorPosition = 0
  private _prefix = ''
  private _schemaPaths: SchemaPath[] = []
  private _selectedCompletionIndex = 0
  private _onFormulaChange: (() => void) | null = null

  constructor(
    private readonly node: FormulaNode,
    rootNode: ObjectNodeStore,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })

    this._value = node.draftFormula
    this._schemaPaths = extractSchemaPaths(rootNode, node.draftId)
  }

  public setOnFormulaChange(callback: () => void): void {
    this._onFormulaChange = callback
  }

  public get value(): string {
    return this._value
  }

  public get validationError(): string | null {
    return this._validationError
  }

  public get isValidating(): boolean {
    return this._isValidating
  }

  public get completionItems(): FormulaCompletionItem[] {
    return this._completionItems
  }

  public get showCompletions(): boolean {
    return this._showCompletions && this._completionItems.length > 0
  }

  public get selectedCompletionIndex(): number {
    return this._selectedCompletionIndex
  }

  public get targetType(): FormulaTargetType {
    if (this.node instanceof StringNodeStore) {
      return 'string'
    }
    if (this.node instanceof NumberNodeStore) {
      return 'number'
    }
    return 'boolean'
  }

  public setValue(value: string): void {
    this._value = value
  }

  public setCursorPosition(position: number): void {
    this._cursorPosition = position
    this.updateCompletions()
  }

  public updateCompletions(): void {
    const prefix = this.extractPrefix()
    this._prefix = prefix

    const result = getFormulaCompletions({
      schemaPaths: this._schemaPaths,
      targetType: this.targetType,
      prefix,
    })

    this._completionItems = result.items
    this._showCompletions = prefix.length > 0 || this._value.length === 0
    this._selectedCompletionIndex = 0
  }

  public hideCompletions(): void {
    this._showCompletions = false
  }

  public showCompletionsPanel(): void {
    this._showCompletions = true
    this.updateCompletions()
  }

  public selectNextCompletion(): void {
    if (this._completionItems.length === 0) {
      return
    }
    this._selectedCompletionIndex = (this._selectedCompletionIndex + 1) % this._completionItems.length
  }

  public selectPreviousCompletion(): void {
    if (this._completionItems.length === 0) {
      return
    }
    this._selectedCompletionIndex =
      (this._selectedCompletionIndex - 1 + this._completionItems.length) % this._completionItems.length
  }

  public getSelectedCompletion(): FormulaCompletionItem | null {
    if (this._completionItems.length === 0) {
      return null
    }
    return this._completionItems[this._selectedCompletionIndex]
  }

  public applyCompletion(item: FormulaCompletionItem): { newValue: string; newCursorPosition: number } {
    const prefixStart = this._cursorPosition - this._prefix.length
    const beforePrefix = this._value.slice(0, prefixStart)
    const afterCursor = this._value.slice(this._cursorPosition)

    let insertText = item.label
    let cursorOffset = insertText.length

    if (item.category === 'function') {
      insertText = item.label + '('
      cursorOffset = insertText.length
    }

    const newValue = beforePrefix + insertText + afterCursor
    const newCursorPosition = prefixStart + cursorOffset

    this._value = newValue
    this._showCompletions = false

    return { newValue, newCursorPosition }
  }

  public getTooltipAt(position: number): TooltipData | null {
    return getTooltipDataAtPosition(this._value, position, this._schemaPaths)
  }

  public validate(): boolean {
    if (!this._value.trim()) {
      this._validationError = null
      const previousFormula = this.node.draftFormula
      this.node.setFormula('')
      if (previousFormula !== '') {
        this._onFormulaChange?.()
      }
      return true
    }

    this._isValidating = true

    try {
      const result = validateFormulaSyntax(this._value)

      runInAction(() => {
        if (result.isValid) {
          this._validationError = null
          const previousFormula = this.node.draftFormula
          this.node.setFormula(this._value)
          if (previousFormula !== this._value) {
            this._onFormulaChange?.()
          }
        } else {
          this._validationError = result.error ?? 'Invalid formula'
        }
        this._isValidating = false
      })

      return result.isValid
    } catch (error) {
      runInAction(() => {
        this._validationError = error instanceof Error ? error.message : 'Validation failed'
        this._isValidating = false
      })
      return false
    }
  }

  private extractPrefix(): string {
    const text = this._value
    const position = this._cursorPosition

    if (position === 0) {
      return ''
    }

    let start = position
    while (start > 0 && this.isWordChar(text[start - 1])) {
      start--
    }

    return text.slice(start, position)
  }

  private isWordChar(char: string): boolean {
    return /[\w@#.[\]*]/.test(char)
  }
}
