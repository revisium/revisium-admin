import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'

export class ForeignKeyValueNode extends BaseValueNode {
  constructor(public readonly store: JsonStringValueStore) {
    super(store, 'foreignKey')
  }
}
