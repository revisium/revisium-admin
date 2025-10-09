import { makeObservable, observable, action } from 'mobx'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'
import { CreateItemValueNode } from './CreateItemValueNode'

export class ArrayValueNode extends BaseValueNode {
  public _children: BaseValueNode[] = []
  private readonly createButtonNode: CreateItemValueNode

  constructor(store: JsonArrayValueStore) {
    super(store, 'array')

    this.createButtonNode = new CreateItemValueNode(this.arrayStore, () => {
      this.buildChildren()
    })
    this.createButtonNode.setParent(this)

    makeObservable(this, {
      _children: observable,
      createItem: action,
      deleteChild: action,
    })

    this.buildChildren()

    this.expanded = this.isInitiallyExpanded
  }

  get children(): BaseValueNode[] {
    return this._children
  }

  get isExpandable(): boolean {
    return true
  }

  get isInitiallyExpanded(): boolean {
    return true
  }

  get hasChildren(): boolean {
    return true
  }

  private get arrayStore(): JsonArrayValueStore {
    return this.store as JsonArrayValueStore
  }

  private buildChildren() {
    const itemNodes = this.arrayStore.value.map((itemStore, index) => {
      const childNode = createNodeForStore(itemStore)
      childNode.setParent(this)
      childNode.onDelete = () => this.deleteChild(index)
      return childNode
    })

    this._children = [...itemNodes, this.createButtonNode]
  }

  private addNewItem(store: JsonValueStore) {
    const newIndex = this.arrayStore.value.length - 1
    const newNode = createNodeForStore(store)
    newNode.setParent(this)
    newNode.onDelete = () => this.deleteChild(newIndex)

    this._children.splice(-1, 0, newNode)
  }

  public createItem() {
    this.addNewItem(this.arrayStore.createItem())
  }

  public deleteChild(index: number) {
    this.arrayStore.removeItem(index)
    this._children.splice(index, 1)

    this._children.forEach((child, i) => {
      if (i < this._children.length - 1) {
        child.onDelete = () => this.deleteChild(i)
      }
    })
  }
}
