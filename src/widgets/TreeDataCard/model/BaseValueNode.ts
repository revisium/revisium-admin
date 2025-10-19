import { makeObservable, observable, computed, action } from 'mobx'
import { toSortedJsonValue } from 'src/entities/Schema'
import { createJsonValuePathByStore } from 'src/entities/Schema/lib/createJsonValuePathByStore.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { toaster } from 'src/shared/ui'

export type NodeType = 'root' | 'object' | 'array' | 'string' | 'number' | 'boolean' | 'foreignKey' | 'createButton'

export interface MenuItem {
  value: string
  label?: string
  handler?: () => Promise<void> | void
  children?: MenuItem[]
  beforeSeparator?: boolean
  afterSeparator?: boolean
}

export abstract class BaseValueNode {
  public expanded = false

  public parent: BaseValueNode | null = null
  public additionalMenu: MenuItem[] = []

  public children: BaseValueNode[] = []

  protected _store: JsonValueStore
  public readonly nodeType: NodeType

  protected constructor(store: JsonValueStore, nodeType: NodeType) {
    this._store = store
    this.nodeType = nodeType

    makeObservable(
      this,
      {
        expanded: observable,
        parent: observable,
        children: observable,
        indexPath: computed,
        isLastSibling: computed,
        guides: computed,
        json: computed,
        isCollapsible: computed,
        setExpanded: action,
        toggleExpanded: action,
        collapseAll: action,
        expandAll: action,
        setParent: action,
      },
      { autoBind: true },
    )
  }

  public get topMenu(): MenuItem[] {
    return [
      ...(this.isCollapsibleTree
        ? [
            {
              label: 'Expand',
              value: 'expand',
              handler: () => this.expandAll(),
            },
            {
              label: 'Collapse',
              value: 'collapse',
              handler: () => this.collapseAll(),
              afterSeparator: true,
            },
          ]
        : []),
    ]
  }

  public get bottomMenu(): MenuItem[] {
    return [
      {
        label: 'Copy',
        value: 'copy',
        children: [
          { label: 'json', value: 'json', handler: () => this.handleGetJson() },
          ...(this.path ? [{ label: 'path', value: 'path', handler: () => this.handleGetPath() }] : []),
        ],
      },
    ]
  }

  public get menu(): MenuItem[] {
    return [...this.topMenu, ...this.additionalMenu, ...this.bottomMenu]
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

  public get isCollapsibleTree() {
    return this.isCollapsible || this.children.some((child) => child.isCollapsible)
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

  public expandAll(options?: { skipItself?: boolean }) {
    if (!options?.skipItself) {
      this.expanded = true
    }

    for (const child of this.children) {
      if (!child.skipOnExpandAll && child.isCollapsible) {
        child.expandAll()
      }
    }
  }

  public collapseAll(options?: { skipItself?: boolean }) {
    if (!options?.skipItself) {
      this.expanded = false
    }

    for (const child of this.children) {
      if (child.isCollapsible) {
        child.collapseAll()
      }
    }
  }

  public get skipOnExpandAll(): boolean {
    return false
  }

  public getStore(): JsonValueStore {
    return this._store
  }

  public get path() {
    return createJsonValuePathByStore(this._store)
  }

  public get json() {
    return JSON.stringify(toSortedJsonValue(this.getStore()), null, 4)
  }

  private async handleGetJson() {
    await navigator.clipboard.writeText(this.json)

    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }

  private async handleGetPath() {
    await navigator.clipboard.writeText(this.path)

    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }
}
