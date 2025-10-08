import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'
import { IdValueNode } from './IdValueNode'
import { PrimitiveRootNode } from './PrimitiveRootNode'

export class RootValueNode extends BaseValueNode {
  private readonly cardStore: RowDataCardStore
  private readonly idNode: IdValueNode
  private readonly valueNode: BaseValueNode
  private _children: BaseValueNode[] | null = null

  constructor(cardStore: RowDataCardStore) {
    const actualRootName = cardStore.name.value || 'root'
    const rootId = `root-${cardStore.root.nodeId}`
    super(actualRootName, cardStore.root, 'root', rootId)

    this.cardStore = cardStore

    this.idNode = new IdValueNode(this.cardStore)
    this.idNode.setParent(this)

    this.valueNode = this.createValueNode()
    this.valueNode.setParent(this)

    this.expanded = true
  }

  private createValueNode(): BaseValueNode {
    const rootStore = this.cardStore.root

    if (this.isPrimitive()) {
      return new PrimitiveRootNode(rootStore)
    } else {
      return createNodeForStore('', rootStore)
    }
  }

  private isPrimitive(): boolean {
    const store = this.cardStore.root
    return store.type === 'string' || store.type === 'number' || store.type === 'boolean'
  }

  get children(): BaseValueNode[] {
    if (!this._children) {
      this._children = [this.idNode]

      if (!this.isPrimitive()) {
        this._children.push(this.valueNode)
      } else {
        this._children.push(this.valueNode)
      }
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

  public get flattenedNodes(): BaseValueNode[] {
    const result: BaseValueNode[] = []

    const traverse = (node: BaseValueNode, skipNode: boolean = false) => {
      if (!skipNode) {
        result.push(node)
      }

      if (node.expanded && node.hasChildren) {
        node.children.forEach((child) => {
          const shouldSkip = child instanceof PrimitiveRootNode
          traverse(child, shouldSkip)
        })
      }
    }

    this.children.forEach((child) => {
      if (child instanceof IdValueNode) {
        traverse(child)
      } else {
        traverse(child, true)
      }
    })

    return result
  }

  public findNodeById(id: string): BaseValueNode | null {
    const traverse = (node: BaseValueNode): BaseValueNode | null => {
      if (node.id === id) return node

      for (const child of node.children) {
        const found = traverse(child)
        if (found) return found
      }

      return null
    }

    return traverse(this)
  }

  public toggleNode(id: string) {
    const node = this.findNodeById(id)
    if (node?.isExpandable) {
      node.toggleExpanded()
    }
  }
}
