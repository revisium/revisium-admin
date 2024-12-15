import { isTargetOverNode } from 'src/features/SchemaEditor/lib/isTargetOverNode.ts'
import { areThereNodesUnderArray } from 'src/features/SchemaEditor/lib/areThereNodesUnderArray.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'

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
