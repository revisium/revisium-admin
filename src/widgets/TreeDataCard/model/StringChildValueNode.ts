import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'

export class StringChildValueNode extends BaseValueNode {
  constructor(store: JsonStringValueStore) {
    super(store, 'string')
  }

  public get showMenu() {
    return false
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

  public get fieldName() {
    return ''
  }
}
