import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'

export const isTargetOverNode = (node: SchemaNode, parent: SchemaNode): boolean => {
  if (!node.draftParent) {
    return false
  }

  if (node === parent) {
    return true
  }

  return isTargetOverNode(node.draftParent, parent)
}
