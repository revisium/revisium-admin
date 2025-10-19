import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'
import { MarkdownChildValueNode } from './MarkdownChildValueNode'

export class MarkdownParentValueNode extends BaseValueNode {
  constructor(store: JsonStringValueStore) {
    super(store, 'string')

    const child = new MarkdownChildValueNode(store)
    child.setParent(this)
    this.children = [child]
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
}
