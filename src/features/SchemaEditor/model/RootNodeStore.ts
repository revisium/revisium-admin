import { computed, makeAutoObservable, observable } from 'mobx'
import { createViewModel } from 'mobx-utils'
import { IViewModel } from 'mobx-utils/lib/create-view-model'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { JsonPatch } from 'src/entities/Schema/types/json-patch.types.ts'
import { getObjectsAndArrays } from 'src/features/SchemaEditor/lib/getObjectsAndArrays.ts'
import { isProperDrop } from 'src/features/SchemaEditor/lib/isProperDrop.ts'
import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { NodeHistory } from 'src/features/SchemaEditor/model/NodeHistory.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/features/SchemaEditor/model/StringForeignKeyNodeStore.ts'

type RootNodeStoreState = {
  node: SchemaNode
}

export class RootNodeStore {
  public viewMode: ViewerSwitcherMode = ViewerSwitcherMode.Tree

  private state: RootNodeStoreState & IViewModel<RootNodeStoreState>
  private history: NodeHistory = new NodeHistory()

  constructor(node: SchemaNode = new ObjectNodeStore()) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.state = createViewModel(
      observable({
        node,
      }),
    )
  }

  public get node() {
    return this.state.node
  }

  public get tableId(): string {
    return this.state.node.draftId
  }

  public get isApproveDisabled(): boolean {
    return !this.state.node.isValid || !this.state.node.isDirty
  }

  public get isDirty(): boolean {
    return this.state.node.isDirty
  }

  public getPlainSchema() {
    return this.state.node.getSchema().getPlainSchema()
  }

  public setViewMode(value: ViewerSwitcherMode): void {
    this.viewMode = value
  }

  public getPatches(): JsonPatch[] {
    if (this.state.node !== this.state.model.node) {
      return [{ op: 'replace', path: '', value: this.state.node.getSchema().getPlainSchema() }]
    } else {
      return [...this.history.getPatches(this.state.node)]
    }
  }

  public areThereDropTargets(node: SchemaNode): boolean {
    return computed(() => {
      const targets = getObjectsAndArrays(this.state.node).filter((target) => {
        return isProperDrop(target, node)
      })
      return Boolean(targets.length)
    }).get()
  }

  public replaceNode(node: SchemaNode): void {
    this.state.node = node
  }

  public submitChanges(): void {
    this.node.submitChanges()
    this.history.reset()
  }

  public resetChanges(): void {
    this.node.resetChanges()
    this.history.reset()
  }

  public setId(node: SchemaNode, id: string): void {
    node.setId(id)
    if (node.parent) {
      this.history.setId(node)
    }
  }

  public addProperty(
    parent: ObjectNodeStore,
    node: SchemaNode,
    options: { afterNode?: SchemaNode; beforeNode?: SchemaNode } | null = null,
  ): void {
    parent.addProperty(node, options)

    if (node.parent) {
      this.history.move(node)
    } else {
      this.history.add(node)
    }
  }

  public removeProperty(parent: ObjectNodeStore, node: SchemaNode): void {
    parent.removeProperty(node.nodeId)
    this.history.remove(node)
  }

  public replaceProperty(parent: ObjectNodeStore, previousProperty: SchemaNode, nextProperty: SchemaNode): void {
    parent.replaceProperty(previousProperty, nextProperty)
    this.history.replace(previousProperty, nextProperty)
  }

  public replaceItems(parent: ArrayNodeStore, nextItems: SchemaNode): void {
    const previousItems = parent.draftItems
    parent.replaceItems(nextItems)

    if (nextItems.parent) {
      this.history.move(nextItems)
    } else {
      this.history.replace(previousItems, nextItems)
    }
  }

  public setForeignKey(string: StringNodeStore, foreignKey: StringForeignKeyNodeStore | null) {
    string.setForeignKey(foreignKey)
    this.history.replace(string, string)
  }

  public setForeignKeyValue(foreignKeyNode: StringForeignKeyNodeStore | null, tableId: string) {
    if (foreignKeyNode && foreignKeyNode.draftParent) {
      foreignKeyNode.setForeignKey(tableId)
      this.history.replace(foreignKeyNode.draftParent, foreignKeyNode.draftParent)
    }
  }
}
