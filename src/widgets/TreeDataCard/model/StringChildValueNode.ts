import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { IStringValueNode } from 'src/widgets/TreeDataCard/config/interface.ts'
import { BaseValueNode } from './BaseValueNode'

export class StringChildValueNode extends BaseValueNode implements IStringValueNode {
  constructor(
    store: JsonStringValueStore,
    private readonly onSetValue: (value: string) => void,
  ) {
    super(store, 'string')
  }

  public get value() {
    return (this._store as JsonStringValueStore).getPlainValue()
  }

  public get fieldName() {
    return ''
  }

  public setValue(value: string): void {
    this.onSetValue(value)
  }
}
