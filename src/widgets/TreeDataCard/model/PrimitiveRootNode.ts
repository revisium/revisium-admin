import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'

export class PrimitiveRootNode extends BaseValueNode {
  private readonly primitiveStore: JsonValueStore
  private _children: BaseValueNode[] | null = null

  constructor(primitiveStore: JsonValueStore) {
    super('', primitiveStore, primitiveStore.type)
    this.primitiveStore = primitiveStore
    this.expanded = this.isInitiallyExpanded
  }

  get children(): BaseValueNode[] {
    if (!this._children) {
      this._children = []

      const valueNode = createNodeForStore('<root value>', this.primitiveStore)
      valueNode.setParent(this)
      this._children.push(valueNode)
    }

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
}
