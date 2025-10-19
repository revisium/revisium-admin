import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { IStringValueNode } from 'src/widgets/TreeDataCard/config/interface.ts'
import { BaseValueNode } from './BaseValueNode'

export class MarkdownChildValueNode extends BaseValueNode implements IStringValueNode {
  constructor(private readonly store: JsonStringValueStore) {
    super(store, 'string')
  }

  public get value() {
    return this.store.getPlainValue()
  }

  public get fieldName() {
    return ''
  }

  public setValue(value: string) {
    this.store.setValue(value)
  }
}
