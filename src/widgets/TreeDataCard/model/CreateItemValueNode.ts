import { ArrayValueNode } from './ArrayValueNode'
import { BaseValueNode } from './BaseValueNode'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store'

export class CreateItemValueNode extends BaseValueNode {
  private readonly onItemCreated?: () => void

  constructor(arrayStore: JsonArrayValueStore, onItemCreated?: () => void) {
    super(arrayStore, 'createButton')

    this.onItemCreated = onItemCreated
  }

  get dataTestId(): string {
    return `${this.parent?.dataTestId}`
  }

  get arrayStore(): JsonArrayValueStore {
    return this._store as JsonArrayValueStore
  }

  createItem() {
    if (this.parent && 'createItem' in this.parent) {
      ;(this.parent as ArrayValueNode).createItem()
    } else {
      this.arrayStore.createItem()
      if (this.onItemCreated) {
        this.onItemCreated()
      }
    }
  }
}
