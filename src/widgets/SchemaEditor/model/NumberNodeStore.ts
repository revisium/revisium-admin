import { makeAutoObservable, observable } from 'mobx'
import { createViewModel } from 'mobx-utils'
import { IViewModel } from 'mobx-utils/lib/create-view-model'
import { nanoid } from 'nanoid'
import { JsonNumberSchema, JsonRefSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { getLabelByRef } from 'src/entities/Schema/config/consts.ts'
import { addSharedFieldsFromState } from 'src/widgets/SchemaEditor/lib/addSharedFieldsFromState.ts'
import { NodeStoreType, ParentSchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'

type NumberNodeStoreState = {
  id: string
  isReplaced: boolean
  parent: ParentSchemaNode | null
  connectedToParent: boolean
  title: string
  description: string
  deprecated: boolean
}

export class NumberNodeStore {
  public nodeId = nanoid()
  public readonly type: NodeStoreType = NodeStoreType.Number
  public isCollapsible = false
  public isCollapsed = false
  public showSettings = false

  public $ref: string = ''

  private state: NumberNodeStoreState & IViewModel<NumberNodeStoreState>

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.state = createViewModel(
      observable({
        id: '',
        isReplaced: false,
        parent: null,
        connectedToParent: false,
        title: '',
        description: '',
        deprecated: false,
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

  public get title() {
    return this.state.model.title
  }

  public get draftTitle() {
    return this.state.title
  }

  public get description() {
    return this.state.model.description
  }

  public get draftDescription() {
    return this.state.description
  }

  public get deprecated() {
    return this.state.model.deprecated
  }

  public get draftDeprecated() {
    return this.state.deprecated
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
      return addSharedFieldsFromState(
        {
          $ref: this.$ref,
        },
        this.state,
      )
    }

    const schema: JsonNumberSchema = {
      type: JsonSchemaTypeName.Number,
      default: 0,
    }

    return addSharedFieldsFromState(schema, this.state)
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

  public setIsReplaced(value: boolean): void {
    this.state.isReplaced = value
  }

  public setTitle(value: string): void {
    this.state.title = value
  }

  public setDescription(value: string): void {
    this.state.description = value
  }

  public setDeprecated(value: boolean): void {
    this.state.deprecated = value
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

  public toggleSettings() {
    this.showSettings = !this.showSettings
  }
}
