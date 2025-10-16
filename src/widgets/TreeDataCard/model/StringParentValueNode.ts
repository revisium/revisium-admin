import { computed, makeObservable } from 'mobx'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'
import { StringChildValueNode } from './StringChildValueNode'

export const STRING_COLLAPSE_THRESHOLD = 64

export class StringParentValueNode extends BaseValueNode {
  private readonly _childNode: StringChildValueNode

  constructor(store: JsonStringValueStore) {
    super(store, 'string')

    this._childNode = new StringChildValueNode(store)
    this._childNode.setParent(this)

    makeObservable(this, {
      isCollapsible: computed,
    })

    this.expanded = this.isInitiallyExpanded
  }

  public get isCollapsible(): boolean {
    const store = this._store as JsonStringValueStore
    const text = store.value || ''
    return text.length > STRING_COLLAPSE_THRESHOLD
  }

  public get collapseChildrenLabel() {
    const store = this._store as JsonStringValueStore
    const text = store.value || ''

    if (!text.trim()) {
      return `<empty text>`
    }

    const wordCount = text.trim().split(/\s+/).length
    const word = wordCount === 1 ? 'word' : 'words'
    return `<text: ${wordCount} ${word}>`
  }

  get children(): BaseValueNode[] {
    return this.isCollapsible ? [this._childNode] : []
  }

  get isExpandable(): boolean {
    return this.isCollapsible
  }

  get isInitiallyExpanded(): boolean {
    return false
  }

  get hasChildren(): boolean {
    return this.isCollapsible
  }

  public override get skipOnExpandAll(): boolean {
    return false
  }

  public override collapseAll() {
    this.expanded = false
  }
}
