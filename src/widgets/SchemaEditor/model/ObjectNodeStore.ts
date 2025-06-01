import { makeAutoObservable, observable } from 'mobx'
import { createViewModel } from 'mobx-utils'
import { IViewModel } from 'mobx-utils/lib/create-view-model'
import { nanoid } from 'nanoid'
import { JsonObjectSchema, JsonRefSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { getLabelByRef } from 'src/entities/Schema/config/consts.ts'
import { SchemaFilter } from 'src/widgets/SchemaEditor/config/types.ts'
import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { NodeStoreType, ParentSchemaNode, SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'

type ObjectNodeStoreState = {
  id: string
  properties: SchemaNode[]
  parent: ParentSchemaNode | null
  connectedToParent: boolean
}

export class ObjectNodeStore {
  public nodeId = nanoid()
  public readonly type: NodeStoreType = NodeStoreType.Object
  public isCollapsible = true
  public isCollapsed = false

  public $ref: string = ''

  private state: ObjectNodeStoreState & IViewModel<ObjectNodeStoreState>

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.state = createViewModel(
      observable({
        id: '',
        properties: [],
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

  public get properties(): SchemaNode[] {
    return this.state.model.properties
  }

  public get draftProperties(): SchemaNode[] {
    return this.state.properties
  }

  public get addedProperties(): SchemaNode[] {
    return this.draftProperties.filter(
      (property) =>
        !property.parent && !this.properties.find((previousProperty) => previousProperty.nodeId === property.nodeId),
    )
  }

  public get removedProperties(): SchemaNode[] {
    return this.properties.filter((previousProperty) => {
      const isNotReplacedProperty = !this.draftProperties.find(
        (property) => property.nodeId === previousProperty.nodeId,
      )
      return !previousProperty.draftConnectedToParent && isNotReplacedProperty
    })
  }

  public get notChangedProperties(): SchemaNode[] {
    return this.properties.filter((property) => this.draftProperties.find((item) => item === property))
  }

  public get replacedProperties(): { previousProperty: SchemaNode; currentProperty: SchemaNode }[] {
    return this.properties
      .filter((previousProperty) =>
        this.draftProperties.find(
          (property) => property.nodeId === previousProperty.nodeId && property !== previousProperty,
        ),
      )
      .map((previousProperty) => {
        const currentProperty = this.draftProperties.find((property) => property.nodeId === previousProperty.nodeId)

        if (!currentProperty) {
          throw new Error('Invalid replacedProperties')
        }

        return {
          previousProperty,
          currentProperty,
        }
      })
  }

  public get movedProperties(): SchemaNode[] {
    return this.draftProperties.filter((property) => property.parent && property.parent !== this)
  }

  public get changedIdProperties(): { previousProperty: SchemaNode; currentProperty: SchemaNode }[] {
    return this.draftProperties
      .filter((property) => {
        const previousProperty = this.properties.find((previousProperty) => previousProperty.nodeId === property.nodeId)

        return previousProperty && property.draftId !== previousProperty.id
      })
      .map((currentProperty) => {
        const previousProperty = this.properties.find((property) => property.nodeId === currentProperty.nodeId)

        if (!previousProperty) {
          throw new Error('Invalid replacedProperties')
        }

        return {
          previousProperty,
          currentProperty,
        }
      })
  }

  public getSchema(filter?: SchemaFilter): JsonObjectSchema | JsonRefSchema {
    if (this.$ref) {
      return {
        $ref: this.$ref,
      }
    }

    const properties: JsonObjectSchema['properties'] = {}
    const required: JsonObjectSchema['required'] = []

    if (!filter?.skipObjectProperties) {
      this.state.properties.forEach((field) => {
        if (filter?.skipMovedBetweenParentsNodes && field.parent !== field.draftParent) {
          return
        }

        if (field instanceof ArrayNodeStore || field instanceof ObjectNodeStore) {
          properties[field.draftId] = field.getSchema(filter)
        } else {
          properties[field.draftId] = field.getSchema()
        }

        required.push(field.draftId)
      })
    }

    const sortedRequired = required.sort((a, b) => a.localeCompare(b))

    return {
      type: JsonSchemaTypeName.Object,
      additionalProperties: false,
      required: sortedRequired,
      properties,
    }
  }

  public get isValid(): boolean {
    const isUniqueIds =
      new Set(this.state.properties.map((property) => property.draftId)).size === this.state.properties.length

    const isValidFields = this.state.properties.every((property) => property.isValid && Boolean(property.draftId))

    return isUniqueIds && isValidFields
  }

  public get isDirtyItself() {
    return this.state.isDirty
  }

  public get isDirty() {
    return this.isDirtyItself || this.state.properties.some((property) => property.isDirty)
  }

  public get showingCreateField(): boolean {
    if (this.$ref) {
      return false
    }

    return Boolean(this.state.id) || Boolean(this.state.parent)
  }

  public get isDisabledCreateField() {
    const isValidId = Boolean(this.state.id) || (!this.state.id && this.state.parent?.type === NodeStoreType.Array)
    const isValidIdObjectFields = this.state.properties.every((field) => Boolean(field.draftId))

    return !isValidId || !isValidIdObjectFields
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

  public removeProperty(nodeId: string): void {
    const foundIndex = this.state.properties.findIndex((property) => property.nodeId === nodeId)

    if (foundIndex !== -1) {
      const found = this.state.properties[foundIndex]
      found.onRemoveFromParent()

      this.createIfNeededNextProperties()
      this.state.properties.splice(foundIndex, 1)
      this.resetIfNeededProperties()
    }
  }

  public addProperty(
    property: SchemaNode,
    options: { afterNode?: SchemaNode; beforeNode?: SchemaNode } | null = null,
  ): void {
    if (property.draftParent instanceof ObjectNodeStore) {
      property.draftParent.removeProperty(property.nodeId)
    } else if (property.draftParent instanceof ArrayNodeStore) {
      throw new Error('Invalid parent')
    }
    property.setParent(this)

    this.createIfNeededNextProperties()

    const foundBeforeIndex = this.state.properties.findIndex((property) => property === options?.beforeNode)
    const foundAfterIndex = this.state.properties.findIndex((property) => property === options?.afterNode)

    if (foundBeforeIndex !== -1) {
      this.state.properties.splice(foundBeforeIndex, 0, property)
    } else if (foundAfterIndex !== -1) {
      this.state.properties.splice(foundAfterIndex + 1, 0, property)
    } else {
      this.state.properties.push(property)
    }
  }

  public getProperty<T extends SchemaNode>(id: string): T {
    const node = this.properties.find((property) => property.id === id)

    if (!node) {
      throw new Error('Invalid id')
    }

    return node as T
  }

  public getDraftProperty<T extends SchemaNode>(id: string): T {
    const node = this.draftProperties.find((property) => property.id === id)

    if (!node) {
      throw new Error('Invalid id')
    }

    return node as T
  }

  public hasProperty(property: SchemaNode): boolean {
    const found = this.state.properties.find((item) => item === property)
    return Boolean(found)
  }

  public replaceProperty(previousNode: SchemaNode, nextProperty: SchemaNode): void {
    const foundIndex = this.state.properties.findIndex((property) => property.nodeId === previousNode.nodeId)

    if (foundIndex !== -1) {
      previousNode.onRemoveFromParent()

      if (previousNode.parent) {
        nextProperty.setId(previousNode.id)
        nextProperty.setParent(previousNode.parent)
        nextProperty.submitChanges()
      }

      nextProperty.setId(previousNode.draftId)
      nextProperty.setNodeId(previousNode.nodeId)
      nextProperty.setParent(this)

      this.createIfNeededNextProperties()
      this.state.properties.splice(foundIndex, 1, nextProperty)
    }
  }

  public toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed
  }

  public submitChanges(): void {
    this.state.submit()

    for (const property of this.state.properties) {
      property.submitChanges()
    }
  }

  public resetChanges(): void {
    this.state.reset()

    for (const property of this.state.properties) {
      property.resetChanges()
    }
  }

  private createIfNeededNextProperties(): void {
    if (!this.state.isPropertyDirty('properties')) {
      this.state.properties = this.state.properties.slice()
    }
  }

  private resetIfNeededProperties(): void {
    const previousNodeIds = this.state.model.properties.map((property) => property.nodeId)
    const currentNodeIds = this.state.properties.map((property) => property.nodeId)

    if (previousNodeIds.length !== currentNodeIds.length) {
      return
    }

    for (let index = 0; index < previousNodeIds.length; index++) {
      if (previousNodeIds[index] !== currentNodeIds[index]) {
        return
      }
    }

    this.state.resetProperty('properties')
  }
}
