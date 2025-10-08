import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'

export class ForeignKeyValueNode extends BaseValueNode {
  constructor(fieldName: string, store: JsonStringValueStore) {
    super(fieldName, store, 'foreignKey')

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

  get foreignKeyValue(): string | null {
    return this.stringStore.foreignKey || null
  }

  get currentValue(): string {
    return this.stringStore.getPlainValue() as string
  }

  private get stringStore(): JsonStringValueStore {
    return this.store as JsonStringValueStore
  }
}
