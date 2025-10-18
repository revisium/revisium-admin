import { makeObservable, action } from 'mobx'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'
import { CreateItemValueNode } from './CreateItemValueNode'

export class ArrayValueNode extends BaseValueNode {
  private readonly createButtonNode: CreateItemValueNode

  constructor(store: JsonArrayValueStore) {
    super(store, 'array')

    this.createButtonNode = new CreateItemValueNode(this.arrayStore, () => {
      this.buildChildren()
    })
    this.createButtonNode.setParent(this)

    makeObservable(this, {
      createItem: action,
      deleteChild: action,
    })

    this.buildChildren()

    this.expanded = true
  }

  public get collapseChildrenLabel() {
    const count = (this._store as JsonArrayValueStore).value.length

    return `<${count} ${count === 1 ? 'item' : 'items'}>`
  }

  private get arrayStore(): JsonArrayValueStore {
    return this._store as JsonArrayValueStore
  }

  private buildChildren() {
    const itemNodes = this.arrayStore.value.map((itemStore) => {
      const childNode = createNodeForStore(itemStore)
      childNode.setParent(this)
      childNode.onDelete = () => this.deleteChild(childNode)
      return childNode
    })

    this.children = [...itemNodes, this.createButtonNode]
  }

  private addNewItem(store: JsonValueStore) {
    const newNode = createNodeForStore(store)
    newNode.setParent(this)
    newNode.onDelete = () => this.deleteChild(newNode)

    this.children.splice(-1, 0, newNode)
  }

  public createItem() {
    this.addNewItem(this.arrayStore.createItem())
  }

  public deleteChild(child: BaseValueNode) {
    const index = this.arrayStore.value.findIndex((item) => item === child.getStore())

    this.arrayStore.removeItem(index)
    this.children.splice(index, 1)
  }

  public override expandAll(options?: { skipItself?: boolean }) {
    if (!options?.skipItself) {
      this.expanded = true
    }

    for (const child of this.children) {
      if (child.isCollapsible && !child.skipOnExpandAll) {
        child.setExpanded(true)
        child.expandAll()
      }
    }
  }

  public override collapseAll(options?: { skipItself?: boolean }) {
    if (!options?.skipItself) {
      this.expanded = false
    }

    for (const child of this.children) {
      if (child.isCollapsible) {
        child.setExpanded(false)
        child.collapseAll()
      }
    }
  }
}
