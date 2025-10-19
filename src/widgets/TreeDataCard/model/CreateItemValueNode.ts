import { BaseValueNode } from './BaseValueNode'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store'

export class CreateItemValueNode extends BaseValueNode {
  constructor(
    arrayStore: JsonArrayValueStore,
    private readonly onItemCreated: () => void,
  ) {
    super(arrayStore, 'createButton')
  }

  public get dataTestId(): string {
    return `${this.parent?.dataTestId}`
  }

  public createItem() {
    this.onItemCreated()
  }
}
