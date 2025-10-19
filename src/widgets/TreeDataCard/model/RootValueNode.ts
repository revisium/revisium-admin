import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'
import { IdValueNode } from './IdValueNode'
import { PrimitiveRootNode } from './PrimitiveRootNode'

const AUTO_COLLAPSE_THRESHOLD = 40

export class RootValueNode extends BaseValueNode {
  private readonly cardStore: RowDataCardStore
  private readonly idNode: IdValueNode
  private readonly valueNode: BaseValueNode

  constructor(cardStore: RowDataCardStore) {
    super(cardStore.root, 'root')

    this.cardStore = cardStore

    this.valueNode = this.createValueNode()
    this.valueNode.setParent(this)

    this.idNode = new IdValueNode(this.cardStore, this.valueNode)
    this.idNode.setParent(this)

    this.children = [this.idNode, this.valueNode]

    this.expanded = true

    if (this.flattenedNodes.length > AUTO_COLLAPSE_THRESHOLD) {
      this.valueNode.collapseAll({ skipItself: true })
    }
  }

  private createValueNode(): BaseValueNode {
    const rootStore = this.cardStore.root

    if (this.isPrimitive()) {
      return new PrimitiveRootNode(rootStore)
    } else {
      return createNodeForStore(rootStore)
    }
  }

  private isPrimitive(): boolean {
    const store = this.cardStore.root
    return store.type === 'string' || store.type === 'number' || store.type === 'boolean'
  }

  public get flattenedNodes(): BaseValueNode[] {
    const result: BaseValueNode[] = []

    const traverse = (node: BaseValueNode, skipNode: boolean = false) => {
      if (!skipNode) {
        result.push(node)
      }

      if (node.expanded) {
        for (const child of node.children) {
          const shouldSkip = child instanceof PrimitiveRootNode
          traverse(child, shouldSkip)
        }
      }
    }

    for (const child of this.children) {
      if (child instanceof IdValueNode) {
        traverse(child)
      } else {
        traverse(child, true)
      }
    }

    return result
  }

  public get isCollapsible() {
    return this.valueNode.isCollapsible
  }

  public saveExpandedState(): Map<string, boolean> {
    const expandedState = new Map<string, boolean>()

    const traverse = (node: BaseValueNode) => {
      if (node.isCollapsible) {
        expandedState.set(node.dataTestId, node.expanded)
      }

      for (const child of node.children) {
        traverse(child)
      }
    }

    traverse(this)
    return expandedState
  }

  public restoreExpandedState(expandedState: Map<string, boolean>) {
    const traverse = (node: BaseValueNode) => {
      if (node.isCollapsible && expandedState.has(node.dataTestId)) {
        node.expanded = expandedState.get(node.dataTestId)!
      }

      for (const child of node.children) {
        traverse(child)
      }
    }

    traverse(this)
  }
}
