import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store'
import { BaseValueNode } from './BaseValueNode'

export class BooleanValueNode extends BaseValueNode {
  constructor(private readonly store: JsonBooleanValueStore) {
    super(store, 'boolean')
  }

  public get value() {
    return this.store.getPlainValue()
  }

  public setValue(value: boolean) {
    this.store.setValue(value)
  }
}
