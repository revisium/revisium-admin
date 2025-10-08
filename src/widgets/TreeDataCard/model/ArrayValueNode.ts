import { makeObservable, observable, action } from 'mobx'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'
import { CreateItemValueNode } from './CreateItemValueNode'

export class ArrayValueNode extends BaseValueNode {
  public _children: BaseValueNode[] = []
  private readonly createButtonNode: CreateItemValueNode

  constructor(fieldName: string, store: JsonArrayValueStore) {
    super(fieldName, store, 'array')

    this.createButtonNode = new CreateItemValueNode('+ Add Item', this.arrayStore, () => {
      this.buildChildren()
    })
    this.createButtonNode.setParent(this)

    makeObservable(this, {
      _children: observable,
      createItem: action,
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
      const childNode = createNodeForStore(`[${index}]`, itemStore)
      childNode.setParent(this)
      return childNode
    })

    this._children = [...itemNodes, this.createButtonNode]
  }

  public createItem() {
    this.arrayStore.createItem()
    this.buildChildren()
  }
}
