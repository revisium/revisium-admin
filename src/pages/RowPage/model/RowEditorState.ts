import { makeAutoObservable } from 'mobx'
import {
  RowEditorVM,
  type RowEditorCallbacks,
  type RowEditorMode,
  type JsonSchema as ToolkitJsonSchema,
} from '@revisium/schema-toolkit-ui'
import { ViewerSwitcherMode } from 'src/entities/Schema'

export interface RowEditorStateItemRef {
  item: unknown | null
}

export class RowEditorState {
  public readonly editor: RowEditorVM
  public readonly itemRef: RowEditorStateItemRef
  public viewMode: ViewerSwitcherMode = ViewerSwitcherMode.Tree
  public scrollPosition: number | null = null

  private readonly _foreignKeysCount: number

  constructor(params: {
    schema: ToolkitJsonSchema
    initialValue?: unknown
    mode: RowEditorMode
    rowId: string
    refSchemas?: Record<string, ToolkitJsonSchema>
    callbacks?: RowEditorCallbacks
    foreignKeysCount?: number
    itemRef?: RowEditorStateItemRef
  }) {
    this.editor = new RowEditorVM(params.schema, params.initialValue, {
      mode: params.mode,
      rowId: params.rowId,
      refSchemas: params.refSchemas,
      callbacks: params.callbacks,
    })
    this._foreignKeysCount = params.foreignKeysCount ?? 0
    this.itemRef = params.itemRef ?? { item: null }
    makeAutoObservable(this, { itemRef: false }, { autoBind: true })
  }

  public get areThereForeignKeysBy(): boolean {
    return this._foreignKeysCount > 0
  }

  public get hasChanges(): boolean {
    return this.editor.hasChanges
  }

  public get isValid(): boolean {
    return this.editor.isValid
  }

  public get rowId(): string {
    return this.editor.rowId
  }

  public setViewMode(value: ViewerSwitcherMode): void {
    this.viewMode = value
  }

  public setScrollPosition(value: number | null): void {
    this.scrollPosition = value
  }

  public dispose(): void {
    this.editor.dispose()
  }
}
