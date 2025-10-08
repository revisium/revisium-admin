import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'

export class StringValueNode extends BaseValueNode {
  constructor(fieldName: string, store: JsonStringValueStore) {
    super(fieldName, store, 'string')

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
