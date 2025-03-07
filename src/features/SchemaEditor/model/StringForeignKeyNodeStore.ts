import { makeAutoObservable, observable } from 'mobx'
import { createViewModel } from 'mobx-utils'
import { IViewModel } from 'mobx-utils/lib/create-view-model'
import { nanoid } from 'nanoid'
import { NodeStoreType, SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'

type StringForeignKeyNodeStoreState = {
  foreignKey: string | null
  parent: StringNodeStore | null
  connectedToParent: boolean
}

export class StringForeignKeyNodeStore {
  public nodeId = nanoid()
  public readonly type: NodeStoreType = NodeStoreType.StringForeignKey

  private state: StringForeignKeyNodeStoreState & IViewModel<StringForeignKeyNodeStoreState>

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.state = createViewModel(
      observable({
        foreignKey: null,
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

  public get foreignKey(): string | null {
    return this.state.model.foreignKey
  }

  public get draftForeignKey(): string | null {
    return this.state.foreignKey
  }

  public get isDirtyItself(): boolean {
    return this.state.isDirty
  }

  public setForeignKey(value: string | null): void {
    this.state.foreignKey = value
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
