import { makeAutoObservable, observable } from 'mobx'
import { createViewModel } from 'mobx-utils'
import { IViewModel } from 'mobx-utils/lib/create-view-model'
import { nanoid } from 'nanoid'
import { JsonStringStore } from 'src/entities/Schema/model/json-string.store.ts'
import { NodeStoreType, ParentSchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { StringReferenceNodeStore } from 'src/features/SchemaEditor/model/StringReferenceNodeStore.ts'

type StringNodeStoreState = {
  id: string
  reference: StringReferenceNodeStore | null
  parent: ParentSchemaNode | null
  connectedToParent: boolean
}

export class StringNodeStore {
  public nodeId = nanoid()
  public readonly type: NodeStoreType = NodeStoreType.String

  private state: StringNodeStoreState & IViewModel<StringNodeStoreState>

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.state = createViewModel(
      observable({
        id: '',
        reference: null,
        parent: null,
        connectedToParent: false,
      }),
    )
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

  public get reference(): StringReferenceNodeStore | null {
    return this.state.model.reference
  }

  public get draftReference(): StringReferenceNodeStore | null {
    return this.state.reference
  }

  public getSchema(): JsonStringStore {
    const schema = new JsonStringStore()
    schema.reference = this.state.reference?.draftReference !== null ? this.state.reference?.draftReference : undefined

    return schema
  }

  public get isValid(): boolean {
    if (this.state.reference && !this.state.reference.draftReference) {
      return false
    }

    return true
  }

  public get isDirtyItself() {
    return this.state.isDirty || Boolean(this.state.reference && this.state.reference.isDirtyItself)
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

  public setReference(value: StringReferenceNodeStore | null): void {
    this.state.reference = value

    if (value) {
      value.setParent(this)
    }
  }

  public submitChanges(): void {
    this.state.submit()

    if (this.state.reference) {
      this.state.reference.submitChanges()
    }
  }

  public resetChanges(): void {
    this.state.reset()

    if (this.state.reference) {
      this.state.reference.resetChanges()
    }
  }
}
