import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'

export class StringValueNode extends BaseValueNode {
  constructor(store: JsonStringValueStore) {
    super(store, 'string')

    this.expanded = this.isInitiallyExpanded
  }

  public get showMenu() {
    return Boolean(this.onDelete)
  }

  get children(): BaseValueNode[] {
    return []
  }

  get isExpandable(): boolean {
    return false
  }

  get isInitiallyExpanded(): boolean {
    return false
  }

  get hasChildren(): boolean {
    return false
  }
}
