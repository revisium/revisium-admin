import { jsonValueStoreSorting } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'

export class ObjectValueNode extends BaseValueNode {
  constructor(store: JsonObjectValueStore) {
    super(store, 'object')

    this.buildChildren()

    this.expanded = this.objectStore.$ref !== SystemSchemaIds.File
  }

  public get collapseChildrenLabel() {
    const count = this.children?.length ?? 0

    return `<${count} ${count === 1 ? 'key' : 'keys'}>`
  }

  private get objectStore(): JsonObjectValueStore {
    return this._store as JsonObjectValueStore
  }

  public override get skipOnExpandAll(): boolean {
    return this.objectStore.$ref === SystemSchemaIds.File
  }

  private buildChildren() {
    const currentEntries = jsonValueStoreSorting(this.objectStore)

    this.children = currentEntries.map(([, childStore]) => {
      const childNode = createNodeForStore(childStore)
      childNode.setParent(this)
      return childNode
    })
  }
}
