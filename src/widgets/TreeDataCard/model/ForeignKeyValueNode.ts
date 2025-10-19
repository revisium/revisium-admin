import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'

export class ForeignKeyValueNode extends BaseValueNode {
  constructor(store: JsonStringValueStore) {
    super(store, 'foreignKey')
  }

  public get store() {
    return this.getStore() as JsonStringValueStore
  }
}
