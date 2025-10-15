import { jsonValueStoreSorting } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode } from './BaseValueNode'

export class ObjectValueNode extends BaseValueNode {
  private _children: BaseValueNode[] = []

  constructor(store: JsonObjectValueStore) {
    super(store, 'object')

    this.buildChildren()

    this.expanded = this.isInitiallyExpanded
  }

  public get collapseChildrenLabel() {
    const count = this._children?.length ?? 0

    return `<${count} ${count === 1 ? 'key' : 'keys'}>`
  }

  public get children(): BaseValueNode[] {
    return this._children
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
    return this._store as JsonObjectValueStore
  }

  public override expandAll(options?: { skipItself?: boolean }) {
    // if (this.skipOnExpandAll) {
    //   return
    // }

    if (!options?.skipItself) {
      this.expanded = true
    }

    for (const child of this._children) {
      if (child.isExpandable && !child.skipOnExpandAll) {
        child.setExpanded(true)
        child.expandAll()
      }
    }
  }

  public override get skipOnExpandAll(): boolean {
    return this.objectStore.$ref === SystemSchemaIds.File
  }

  public override collapseAll(options?: { skipItself?: boolean }) {
    if (!options?.skipItself) {
      this.expanded = false
    }

    for (const child of this._children) {
      if (child.isExpandable) {
        child.setExpanded(false)
        child.collapseAll()
      }
    }
  }

  private buildChildren() {
    const currentEntries = jsonValueStoreSorting(this.objectStore)

    this._children = currentEntries.map(([, childStore]) => {
      const childNode = createNodeForStore(childStore)
      childNode.setParent(this)
      return childNode
    })
  }
}
