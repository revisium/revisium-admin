import { makeObservable, observable, computed, action } from 'mobx'
import { toSortedJsonValue } from 'src/entities/Schema'
import { createJsonValuePathByStore } from 'src/entities/Schema/lib/createJsonValuePathByStore.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'

export type NodeType = 'root' | 'object' | 'array' | 'string' | 'number' | 'boolean' | 'foreignKey' | 'createButton'

export abstract class BaseValueNode {
  public expanded = false

  public parent: BaseValueNode | null = null
  public onDelete?: () => void

  public children: BaseValueNode[] = []

  protected _store: JsonValueStore
  public readonly nodeType: NodeType

  protected constructor(store: JsonValueStore, nodeType: NodeType) {
    this._store = store
    this.nodeType = nodeType

    makeObservable(this, {
      expanded: observable,
      parent: observable,
      children: observable,
      indexPath: computed,
      isLastSibling: computed,
      guides: computed,
      isCollapsible: computed,
      path: computed,
      setExpanded: action,
      toggleExpanded: action,
      collapseAll: action,
      expandAll: action,
      setParent: action,
    })
  }

  public get fieldName() {
    if (!this._store.id) {
      return '<root value>'
    }

    return this._store.id
  }

  public get collapseChildrenLabel() {
    return ''
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

  public get isCollapsible() {
    return Boolean(this.children.length)
  }

  public setExpanded(expanded: boolean) {
    if (this.isCollapsible) {
      this.expanded = expanded
    }
  }

  public toggleExpanded() {
    this.setExpanded(!this.expanded)
  }

  public setParent(parent: BaseValueNode | null) {
    this.parent = parent
  }

  public collapseAll(_?: { skipItself?: boolean }) {}
  public expandAll(_?: { skipItself?: boolean }) {}
  public get skipOnExpandAll(): boolean {
    return false
  }

  public getStore(): JsonValueStore {
    return this._store
  }

  public getJson() {
    return JSON.stringify(toSortedJsonValue(this.getStore()), null, 4)
  }

  public get path() {
    return createJsonValuePathByStore(this.getStore())
  }
}
