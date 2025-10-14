import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'

export class ForeignKeyValueNode extends BaseValueNode {
  constructor(store: JsonStringValueStore) {
    super(store, 'foreignKey')

    this.expanded = this.isInitiallyExpanded
  }

  public get showMenu() {
    return Boolean(this.onDelete)
  }

  public get children(): BaseValueNode[] {
    return []
  }

  public get isExpandable(): boolean {
    return false
  }

  public get isInitiallyExpanded(): boolean {
    return false
  }

  public get hasChildren(): boolean {
    return false
  }

  public get store() {
    return this.getStore() as JsonStringValueStore
  }
}
