import { makeAutoObservable, observable } from 'mobx'
import { createViewModel } from 'mobx-utils'
import { IViewModel } from 'mobx-utils/lib/create-view-model'
import { nanoid } from 'nanoid'
import { NodeStoreType, SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'

type StringReferenceNodeStoreState = {
  reference: string | null
  parent: StringNodeStore | null
  connectedToParent: boolean
}

export class StringReferenceNodeStore {
  public nodeId = nanoid()
  public readonly type: NodeStoreType = NodeStoreType.StringReference

  private state: StringReferenceNodeStoreState & IViewModel<StringReferenceNodeStoreState>

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.state = createViewModel(
      observable({
        reference: null,
        parent: null,
        connectedToParent: false,
      }),
    )
  }

  public get parent(): SchemaNode | null {
    return this.state.model.parent
  }

  public get draftParent(): SchemaNode | null {
    return this.state.parent
  }

  public get connectedToParent(): boolean {
    return this.state.model.connectedToParent
  }

  public get draftConnectedToParent(): boolean {
    return this.state.connectedToParent
  }

  public setNodeId(value: string): void {
    this.nodeId = value
  }

  public get reference(): string | null {
    return this.state.model.reference
  }

  public get draftReference(): string | null {
    return this.state.reference
  }

  public get isDirtyItself(): boolean {
    return this.state.isDirty
  }

  public setReference(value: string | null): void {
    this.state.reference = value
  }

  public setParent(value: StringNodeStore | null): void {
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
