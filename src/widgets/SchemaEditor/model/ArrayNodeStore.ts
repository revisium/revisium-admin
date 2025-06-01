import { makeAutoObservable, observable } from 'mobx'
import { createViewModel } from 'mobx-utils'
import { IViewModel } from 'mobx-utils/lib/create-view-model'
import { nanoid } from 'nanoid'
import { JsonArraySchema, JsonRefSchema, JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { getLabelByRef } from 'src/entities/Schema/config/consts.ts'
import { SchemaFilter } from 'src/widgets/SchemaEditor/config/types.ts'
import { NodeStoreType, ParentSchemaNode, SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'

type ArrayNodeStoreState = {
  id: string
  items: SchemaNode
  parent: ParentSchemaNode | null
  connectedToParent: boolean
}

export class ArrayNodeStore {
  public nodeId = nanoid()
  public readonly type: NodeStoreType = NodeStoreType.Array
  public isCollapsible = true
  public isCollapsed = false

  public $ref: string = ''

  private state: ArrayNodeStoreState & IViewModel<ArrayNodeStoreState>

  constructor(items: SchemaNode) {
    makeAutoObservable(this, {}, { autoBind: true })

    items.setParent(this)
    items.submitChanges()

    this.state = createViewModel(
      observable({
        id: '',
        items,
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

  public get items(): SchemaNode {
    return this.state.model.items
  }

  public get draftItems(): SchemaNode {
    return this.state.items
  }

  public getSchema(filter?: SchemaFilter): JsonArraySchema | JsonRefSchema {
    if (this.$ref) {
      return {
        $ref: this.$ref,
      }
    }

    return {
      type: JsonSchemaTypeName.Array,
      items: this.getItemsSchema(filter),
    }
  }

  private getItemsSchema(filter?: SchemaFilter): JsonSchema {
    if (this.state.items instanceof ArrayNodeStore) {
      return this.state.items.getSchema(filter)
    } else if (this.state.items instanceof ObjectNodeStore) {
      return this.state.items.getSchema(filter)
    } else {
      return this.state.items.getSchema()
    }
  }

  public get isValid(): boolean {
    return this.state.items.isValid
  }

  public get isDirtyItself() {
    return this.state.isDirty
  }

  public get isDirty() {
    return this.isDirtyItself || this.state.items.isDirty
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

  public replaceItems(nextItems: SchemaNode): void {
    if (nextItems.draftParent instanceof ObjectNodeStore) {
      nextItems.draftParent.removeProperty(nextItems.nodeId)
    }

    nextItems.setNodeId(this.state.items.nodeId)
    nextItems.setParent(this)

    this.state.items = nextItems
  }

  public submitChanges(): void {
    this.state.submit()

    this.state.items.submitChanges()
  }

  public toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed
  }

  public resetChanges(): void {
    this.state.reset()

    this.state.items.resetChanges()
  }
}
