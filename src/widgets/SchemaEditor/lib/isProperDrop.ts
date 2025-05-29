import { isTargetOverNode } from 'src/widgets/SchemaEditor/lib/isTargetOverNode.ts'
import { areThereNodesUnderArray } from 'src/widgets/SchemaEditor/lib/areThereNodesUnderArray.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'

export const isProperDrop = (target: SchemaNode, node: SchemaNode): boolean => {
  if (!node.draftParent) {
    return false
  }

  if (target === node) {
    return false
  }

  if (target === node.draftParent) {
    return false
  }

  if (isTargetOverNode(target, node)) {
    return false
  }

  if (areThereNodesUnderArray(target, node)) {
    return false
  }

  return true
}
