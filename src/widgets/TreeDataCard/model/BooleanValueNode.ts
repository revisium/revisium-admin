import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store'
import { BaseValueNode } from './BaseValueNode'

export class BooleanValueNode extends BaseValueNode {
  constructor(fieldName: string, store: JsonBooleanValueStore) {
    super(fieldName, store, 'boolean')

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
