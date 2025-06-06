import { makeAutoObservable, observable } from 'mobx'
import { createViewModel } from 'mobx-utils'
import { IViewModel } from 'mobx-utils/lib/create-view-model'
import { nanoid } from 'nanoid'
import { JsonNumberSchema, JsonRefSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { getLabelByRef } from 'src/entities/Schema/config/consts.ts'
import { NodeStoreType, ParentSchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'

type NumberNodeStoreState = {
  id: string
  parent: ParentSchemaNode | null
  connectedToParent: boolean
}

export class NumberNodeStore {
  public nodeId = nanoid()
  public readonly type: NodeStoreType = NodeStoreType.Number
  public isCollapsible = false
  public isCollapsed = false

  public $ref: string = ''

  private state: NumberNodeStoreState & IViewModel<NumberNodeStoreState>

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.state = createViewModel(
      observable({
        id: '',
        parent: null,
        connectedToParent: false,
      }),
    )
  }

  public get isDisabled(): boolean {
    return Boolean(this.draftParent?.$ref)
  }

  public get label() {
    return getLabelByRef(this.$ref) ?? this.type
  }

  public setNodeId(value: string): void {
    this.nodeId = value
  }

  public get id(): string {
    return this.state.model.id
  }

  public get draftId(): string {
    return this.state.id
  }

  public get parent(): ParentSchemaNode | null {
    return this.state.model.parent
  }

  public get draftParent(): ParentSchemaNode | null {
    return this.state.parent
  }

  public get connectedToParent(): boolean {
    return this.state.model.connectedToParent
  }

  public get draftConnectedToParent(): boolean {
    return this.state.connectedToParent
  }

  public getSchema(): JsonNumberSchema | JsonRefSchema {
    if (this.$ref) {
      return {
        $ref: this.$ref,
      }
    }

    return {
      type: JsonSchemaTypeName.Number,
      default: 0,
    }
  }

  public get isValid(): boolean {
    return true
  }

  public get isDirtyItself() {
    return this.state.isDirty
  }

  public get isDirty() {
    return this.isDirtyItself
  }

  public setId(value: string): void {
    this.state.id = value
  }

  public setParent(value: ParentSchemaNode | null): void {
    this.state.parent = value
    this.state.connectedToParent = true
  }

  public onRemoveFromParent(): void {
    this.state.connectedToParent = false
  }

  public submitChanges(): void {
    this.state.submit()
  }

  public resetChanges(): void {
    this.state.reset()
  }
}
