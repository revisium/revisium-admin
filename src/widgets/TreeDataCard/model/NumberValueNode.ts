import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store'
import { BaseValueNode } from './BaseValueNode'

export class NumberValueNode extends BaseValueNode {
  constructor(store: JsonNumberValueStore) {
    super(store, 'number')

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
