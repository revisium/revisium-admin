import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store'
import { RootValueNode } from 'src/widgets/TreeDataCard/model/RootValueNode.ts'

export function buildTreeStore(cardStore: RowDataCardStore): RootValueNode {
  return new RootValueNode(cardStore)
}
