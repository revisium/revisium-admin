import { makeObservable, observable, computed, action } from 'mobx'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'

export type NodeType = 'root' | 'object' | 'array' | 'string' | 'number' | 'boolean' | 'foreignKey' | 'createButton'

export abstract class BaseValueNode {
  public expanded: boolean = false
  public parent: BaseValueNode | null = null
  public onDelete?: () => void

  protected store: JsonValueStore
  public readonly nodeType: NodeType

  protected constructor(store: JsonValueStore, nodeType: NodeType) {
    this.store = store
    this.nodeType = nodeType

    makeObservable(this, {
      expanded: observable,
      parent: observable,
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

  public get fieldName() {
    if (!this.store.id) {
      return '<root value>'
    }

    return this.store.id
  }

  public get indexPath(): number[] {
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

  public get dataTestId(): string {
    return this.indexPath.join('-')
  }

  public get isLastSibling(): boolean {
    if (!this.parent) return true
    const siblings = this.parent.children
    return siblings[siblings.length - 1] === this
  }

  public get guides(): boolean[] {
    const guides: boolean[] = []
    let current: BaseValueNode | null = this.parent

    while (current?.parent) {
      guides.unshift(!current.isLastSibling)
      current = current.parent
    }

    return guides
  }

  public setExpanded(expanded: boolean) {
    if (this.isExpandable) {
      this.expanded = expanded
    }
  }

  public toggleExpanded() {
    this.setExpanded(!this.expanded)
  }

  public setParent(parent: BaseValueNode | null) {
    this.parent = parent
  }

  abstract get children(): BaseValueNode[]
  abstract get isExpandable(): boolean
  abstract get isInitiallyExpanded(): boolean
  abstract get hasChildren(): boolean

  public getStore(): JsonValueStore {
    return this.store
  }
}
