import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { BaseValueNode } from './BaseValueNode'

export class IdValueNode extends BaseValueNode {
  constructor(
    cardStore: RowDataCardStore,
    private readonly rootValueNode: BaseValueNode,
  ) {
    super(cardStore.name, 'string')
  }

  public get showMenu() {
    return true
  }

  public get fieldName() {
    return '<id>'
  }

  public get children(): BaseValueNode[] {
    return []
  }

  public get isExpandable(): boolean {
    return this.rootValueNode.isExpandable
  }

  public get isInitiallyExpanded(): boolean {
    return false
  }

  public get hasChildren(): boolean {
    return false
  }

  public getStore(): JsonStringValueStore {
    return this._store as JsonStringValueStore
  }

  public getJson(): string {
    return this.rootValueNode.getJson()
  }

  public override expandAll() {
    if (this.rootValueNode.isExpandable) {
      this.rootValueNode.expandAll({ skipItself: true })
    }
  }

  public override collapseAll() {
    if (this.rootValueNode.isExpandable) {
      this.rootValueNode.collapseAll({ skipItself: true })
    }
  }
}
