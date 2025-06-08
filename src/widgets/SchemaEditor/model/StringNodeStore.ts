import { makeAutoObservable, observable } from 'mobx'
import { createViewModel } from 'mobx-utils'
import { IViewModel } from 'mobx-utils/lib/create-view-model'
import { nanoid } from 'nanoid'
import { JsonRefSchema, JsonSchemaTypeName, JsonStringSchema } from 'src/entities/Schema'
import { getLabelByRef } from 'src/entities/Schema/config/consts.ts'
import { NodeStoreType, ParentSchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor/model/StringForeignKeyNodeStore.ts'

type StringNodeStoreState = {
  id: string
  foreignKey: StringForeignKeyNodeStore | null
  contentMediaType: JsonStringSchema['contentMediaType'] | null
  parent: ParentSchemaNode | null
  connectedToParent: boolean
  title: string
  description: string
}

export class StringNodeStore {
  public nodeId = nanoid()
  public readonly type: NodeStoreType = NodeStoreType.String
  public isCollapsible = false
  public isCollapsed = false
  public showSettings = false

  public $ref: string = ''

  private state: StringNodeStoreState & IViewModel<StringNodeStoreState>

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.state = createViewModel(
      observable({
        id: '',
        foreignKey: null,
        contentMediaType: null,
        parent: null,
        connectedToParent: false,
        title: '',
        description: '',
      }),
    )
  }

  public get isDisabled(): boolean {
    return Boolean(this.draftParent?.$ref)
  }

  public get label() {
    if (this.draftForeignKey) {
      return `foreign key`
    }

    if (this.state.contentMediaType) {
      return this.state.contentMediaType
    }

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
    return this.state.model.title
  }

  public get description() {
    return this.state.model.description
  }

  public get draftDescription() {
    return this.state.model.description
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

  public get foreignKey(): StringForeignKeyNodeStore | null {
    return this.state.model.foreignKey
  }

  public get draftForeignKey(): StringForeignKeyNodeStore | null {
    return this.state.foreignKey
  }

  public getSchema(): JsonStringSchema | JsonRefSchema {
    if (this.$ref) {
      return {
        $ref: this.$ref,
      }
    }

    const schema: JsonStringSchema = {
      type: JsonSchemaTypeName.String,
      default: '',
    }

    if (this.state.foreignKey?.draftForeignKey) {
      schema.foreignKey = this.state.foreignKey?.draftForeignKey
    }

    if (this.state.contentMediaType) {
      schema.contentMediaType = this.state.contentMediaType
    }

    if (this.state.title) {
      schema.title = this.state.title
    }

    if (this.state.description) {
      schema.description = this.state.description
    }

    return schema
  }

  public get isValid(): boolean {
    if (this.state.foreignKey && !this.state.foreignKey.draftForeignKey) {
      return false
    }

    return true
  }

  public get isDirtyItself() {
    return this.state.isDirty || Boolean(this.state.foreignKey && this.state.foreignKey.isDirtyItself)
  }

  public get isDirty() {
    return this.isDirtyItself
  }

  public setId(value: string): void {
    this.state.id = value
  }

  public setTitle(value: string): void {
    this.state.title = value
  }

  public setDescription(value: string): void {
    this.state.description = value
  }

  public setParent(value: ParentSchemaNode | null): void {
    this.state.parent = value
    this.state.connectedToParent = true
  }

  public onRemoveFromParent(): void {
    this.state.connectedToParent = false
  }

  public setForeignKey(value: StringForeignKeyNodeStore | null): void {
    this.state.foreignKey = value

    if (value) {
      value.setParent(this)
    }
  }

  public setContentMediaType(value: JsonStringSchema['contentMediaType'] | null): void {
    this.state.contentMediaType = value
  }

  public submitChanges(): void {
    this.state.submit()

    if (this.state.foreignKey) {
      this.state.foreignKey.submitChanges()
    }
  }

  public resetChanges(): void {
    this.state.reset()

    if (this.state.foreignKey) {
      this.state.foreignKey.resetChanges()
    }
  }

  public toggleSettings() {
    this.showSettings = !this.showSettings
  }
}
