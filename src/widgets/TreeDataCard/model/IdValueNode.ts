import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store'
import { IStringValueNode } from 'src/widgets/TreeDataCard/config/interface.ts'
import { BaseValueNode } from './BaseValueNode'

export class IdValueNode extends BaseValueNode implements IStringValueNode {
  constructor(
    private readonly cardStore: RowDataCardStore,
    private readonly rootValueNode: BaseValueNode,
  ) {
    super(cardStore.name, 'string')
  }

  public get value() {
    return this.cardStore.name.getPlainValue()
  }

  public get fieldName() {
    return '<id>'
  }

  public setValue(value: string) {
    this.cardStore.name.setValue(value)
  }

  public get isCollapsible() {
    return this.rootValueNode.isCollapsible
  }

  public override expandAll() {
    this.rootValueNode.expandAll({ skipItself: true })
  }

  public override collapseAll() {
    this.rootValueNode.collapseAll({ skipItself: true })
  }

  public get json(): string {
    return this.rootValueNode.json
  }
}
