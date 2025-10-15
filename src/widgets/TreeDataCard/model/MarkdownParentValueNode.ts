import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'
import { MarkdownChildValueNode } from './MarkdownChildValueNode'

export class MarkdownParentValueNode extends BaseValueNode {
  private readonly _childNode: MarkdownChildValueNode

  constructor(store: JsonStringValueStore) {
    super(store, 'string')

    this._childNode = new MarkdownChildValueNode(store)
    this._childNode.setParent(this)

    this.expanded = this.isInitiallyExpanded
  }

  public get collapseChildrenLabel() {
    const store = this._store as JsonStringValueStore
    const text = store.value || ''

    if (!text.trim()) {
      return `<empty markdown>`
    }

    const wordCount = text.trim().split(/\s+/).length
    const word = wordCount === 1 ? 'word' : 'words'
    return `<markdown: ${wordCount} ${word}>`
  }

  get children(): BaseValueNode[] {
    return [this._childNode]
  }

  get isExpandable(): boolean {
    return true
  }

  get isInitiallyExpanded(): boolean {
    return false
  }

  get hasChildren(): boolean {
    return true
  }

  public override get skipOnExpandAll(): boolean {
    return true
  }

  public override collapseAll() {
    this.expanded = false
  }
}
