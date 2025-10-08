import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'

export interface NodeRendererContext {
  node: BaseValueNode
  isEdit: boolean
}
