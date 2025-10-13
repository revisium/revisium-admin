import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'

export class IdValueNode extends BaseValueNode {
  constructor(cardStore: RowDataCardStore) {
    super(cardStore.name, 'string')
  }

  public get showMenu() {
    return true
  }

  public get fieldName() {
    return '<id>'
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

  getStore(): JsonStringValueStore {
    return this._store as JsonStringValueStore
  }
}
