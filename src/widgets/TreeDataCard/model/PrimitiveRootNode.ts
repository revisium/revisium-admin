import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'

export class PrimitiveRootNode extends BaseValueNode {
  private readonly primitiveStore: JsonValueStore

  constructor(primitiveStore: JsonValueStore) {
    super(primitiveStore, primitiveStore.type)
    this.primitiveStore = primitiveStore
    this.expanded = true

    const valueNode = createNodeForStore(this.primitiveStore)
    valueNode.setParent(this)
    this.children.push(valueNode)
  }
}
