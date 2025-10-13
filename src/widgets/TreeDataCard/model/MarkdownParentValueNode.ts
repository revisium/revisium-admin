import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'
import { MarkdownChildValueNode } from './MarkdownChildValueNode'

export class MarkdownParentValueNode extends BaseValueNode {
  private _childNode: MarkdownChildValueNode

  constructor(store: JsonStringValueStore) {
    super(store, 'string')

    this._childNode = new MarkdownChildValueNode(store)
    this._childNode.setParent(this)

    this.expanded = this.isInitiallyExpanded
  }

  public get collapseChildrenLabel() {
    return `<markdown>`
  }

  get children(): BaseValueNode[] {
    return [this._childNode]
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