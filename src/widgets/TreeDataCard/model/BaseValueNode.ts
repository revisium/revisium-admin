import { makeObservable, observable, computed, action } from 'mobx'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'

export type NodeType = 'root' | 'object' | 'array' | 'string' | 'number' | 'boolean' | 'foreignKey' | 'createButton'

export abstract class BaseValueNode {
  public expanded: boolean = false
  public fieldName: string
  public parent: BaseValueNode | null = null

  protected store: JsonValueStore
  public readonly nodeType: NodeType
  public readonly id: string

  protected constructor(fieldName: string, store: JsonValueStore, nodeType: NodeType, customId?: string) {
    this.fieldName = fieldName
    this.store = store
    this.nodeType = nodeType
    this.id = customId || store.nodeId

    makeObservable(this, {
      expanded: observable,
      fieldName: observable,
      parent: observable,
      depth: computed,
      indexPath: computed,
      isLastSibling: computed,
      guides: computed,
      children: computed,
      isExpandable: computed,
      isInitiallyExpanded: computed,
      hasChildren: computed,
      setExpanded: action,
      toggleExpanded: action,
      setParent: action,
    })
  }

  get depth(): number {
    let depth = 0
    let current: BaseValueNode | null = this.parent
    while (current) {
      depth++
      current = current.parent
    }
    return depth
  }

  get indexPath(): number[] {
    const path: number[] = []
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: BaseValueNode | null = this

    while (current?.parent) {
      const parent = current.parent
      const siblings = parent.children
      const index = siblings.indexOf(current)
      if (index !== -1) {
        path.unshift(index)
      }
      current = parent
    }

    return path
  }

  get dataTestId(): string {
    return this.indexPath.join('-')
  }

  get isLastSibling(): boolean {
    if (!this.parent) return true
    const siblings = this.parent.children
    return siblings[siblings.length - 1] === this
  }

  get guides(): boolean[] {
    const guides: boolean[] = []
    let current: BaseValueNode | null = this.parent

    while (current?.parent) {
      guides.unshift(!current.isLastSibling)
      current = current.parent
    }

    return guides
  }

  setExpanded(expanded: boolean) {
    if (this.isExpandable) {
      this.expanded = expanded
    }
  }

  toggleExpanded() {
    this.setExpanded(!this.expanded)
  }

  setParent(parent: BaseValueNode | null) {
    this.parent = parent
  }

  abstract get children(): BaseValueNode[]
  abstract get isExpandable(): boolean
  abstract get isInitiallyExpanded(): boolean
  abstract get hasChildren(): boolean

  getStore(): JsonValueStore {
    return this.store
  }
}
