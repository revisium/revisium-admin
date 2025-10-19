import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store'
import { BaseValueNode } from './BaseValueNode'

export class NumberValueNode extends BaseValueNode {
  constructor(private readonly store: JsonNumberValueStore) {
    super(store, 'number')
  }

  public get value() {
    return this.store.getPlainValue()
  }

  public get defaultValue() {
    return this.store.default
  }

  public setValue(value: number) {
    this.store.setValue(value)
  }
}
