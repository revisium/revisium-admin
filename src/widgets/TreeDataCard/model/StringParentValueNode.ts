import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { IStringValueNode } from 'src/widgets/TreeDataCard/config/interface.ts'
import { BaseValueNode } from './BaseValueNode'
import { StringChildValueNode } from './StringChildValueNode'

export const STRING_COLLAPSE_THRESHOLD = 64

export class StringParentValueNode extends BaseValueNode implements IStringValueNode {
  constructor(private readonly store: JsonStringValueStore) {
    super(store, 'string')

    const childNode = new StringChildValueNode(store, (value) => {
      this.setValue(value)
    })
    childNode.setParent(this)

    this.children.push(childNode)
  }

  public get value(): string {
    return this.store.getPlainValue()
  }

  public get isCollapsible(): boolean {
    return this.isLongText
  }

  public get collapseChildrenLabel() {
    const text = this.store.value || ''

    if (!text.trim()) {
      return `<empty text>`
    }

    const wordCount = text.trim().split(/\s+/).length
    const word = wordCount === 1 ? 'word' : 'words'
    return `<text: ${wordCount} ${word}>`
  }

  public override get skipOnExpandAll(): boolean {
    return false
  }

  public setValue(value: string): void {
    const wasCollapsible = this.isCollapsible

    this.store.setValue(value)

    if (!wasCollapsible && this.isCollapsible) {
      this.expanded = true
    } else if (wasCollapsible && !this.isCollapsible) {
      this.expanded = false
    }
  }

  public override collapseAll() {
    this.expanded = false
  }

  private get isLongText() {
    const text = this.store.getPlainValue()
    return text.length > STRING_COLLAPSE_THRESHOLD
  }
}
