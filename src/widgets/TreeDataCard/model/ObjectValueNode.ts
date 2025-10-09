import { priorityObjectValueSorting } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'

export class ObjectValueNode extends BaseValueNode {
  private childrenCache: BaseValueNode[] | null = null

  constructor(store: JsonObjectValueStore) {
    super(store, 'object')

    this.expanded = this.isInitiallyExpanded
  }

  public get children(): BaseValueNode[] {
    const currentEntries = priorityObjectValueSorting(this.objectStore)

    if (!this.childrenCache) {
      this.childrenCache = currentEntries.map(([, childStore]) => {
        const childNode = createNodeForStore(childStore)
        childNode.setParent(this)
        return childNode
      })
    }

    return this.childrenCache
  }

  public get isExpandable(): boolean {
    return Object.keys(this.objectStore.value).length > 0
  }

  public get isInitiallyExpanded(): boolean {
    const isFile = this.objectStore.$ref === SystemSchemaIds.File
    return !isFile
  }

  public get hasChildren(): boolean {
    return Object.keys(this.objectStore.value).length > 0
  }

  private get objectStore(): JsonObjectValueStore {
    return this.store as JsonObjectValueStore
  }
}
