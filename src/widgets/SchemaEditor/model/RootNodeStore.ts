import { computed, makeAutoObservable, observable } from 'mobx'
import { createViewModel } from 'mobx-utils'
import { IViewModel } from 'mobx-utils/lib/create-view-model'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { JsonPatch } from 'src/entities/Schema/types/json-patch.types.ts'
import { getObjectsAndArrays } from 'src/widgets/SchemaEditor/lib/getObjectsAndArrays.ts'
import { isProperDrop } from 'src/widgets/SchemaEditor/lib/isProperDrop.ts'
import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { NodeHistory } from 'src/widgets/SchemaEditor/model/NodeHistory.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor/model/StringForeignKeyNodeStore.ts'

type RootNodeStoreState = {
  node: SchemaNode
  tableId: string
}

export class RootNodeStore {
  public viewMode: ViewerSwitcherMode = ViewerSwitcherMode.Tree

  private readonly state: RootNodeStoreState & IViewModel<RootNodeStoreState>
  private readonly history: NodeHistory = new NodeHistory()

  constructor(node: SchemaNode = new ObjectNodeStore(), tableId = '') {
    makeAutoObservable(this, {}, { autoBind: true })

    this.state = createViewModel(
      observable({
        node,
        tableId,
      }),
    )
  }

  public get node() {
    return this.state.node
  }

  public get tableId(): string {
    return this.state.tableId
  }

  public get draftTableId(): string {
    return this.state.node.draftId
  }

  public get isApproveDisabled(): boolean {
    return !this.state.node.isValid || !this.state.node.isDirty
  }

  public get isDirty(): boolean {
    return this.state.node.isDirty
  }

  public get isDirtyItself() {
    return this.state.node.isDirtyItself
  }

  public getPlainSchema() {
    return this.state.node.getSchema()
  }

  public setViewMode(value: ViewerSwitcherMode): void {
    this.viewMode = value
  }

  public getPatches(): JsonPatch[] {
    if (this.state.node !== this.state.model.node) {
      return [{ op: 'replace', path: '', value: this.state.node.getSchema() }]
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
    this.state.tableId = this.node.id
    this.state.submit()
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
    if (foreignKeyNode?.draftParent) {
      foreignKeyNode.setForeignKey(tableId)
      this.history.replace(foreignKeyNode.draftParent, foreignKeyNode.draftParent)
    }
  }
}
