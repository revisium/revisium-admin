import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store'
import { BaseValueNode } from './BaseValueNode'

export class NumberValueNode extends BaseValueNode {
  constructor(fieldName: string, store: JsonNumberValueStore) {
    super(fieldName, store, 'number')

    this.expanded = this.isInitiallyExpanded
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
