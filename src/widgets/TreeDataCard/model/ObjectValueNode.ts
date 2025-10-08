import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'

export class ObjectValueNode extends BaseValueNode {
  private childrenCache: BaseValueNode[] | null = null

  constructor(fieldName: string, store: JsonObjectValueStore) {
    super(fieldName, store, 'object')

    this.expanded = this.isInitiallyExpanded
  }

  get children(): BaseValueNode[] {
    const currentEntries = Object.entries(this.objectStore.value)

    if (!this.childrenCache) {
      this.childrenCache = currentEntries.map(([key, childStore]) => {
        const childNode = createNodeForStore(key, childStore)
        childNode.setParent(this)
        return childNode
      })
    }

    return this.childrenCache
  }

  get isExpandable(): boolean {
    return Object.keys(this.objectStore.value).length > 0
  }

  get isInitiallyExpanded(): boolean {
    const isFile = this.objectStore.$ref === SystemSchemaIds.File
    return !isFile
  }

  get hasChildren(): boolean {
    return Object.keys(this.objectStore.value).length > 0
  }

  private get objectStore(): JsonObjectValueStore {
    return this.store as JsonObjectValueStore
  }

  invalidateChildrenCache() {
    this.childrenCache = null
  }
}
