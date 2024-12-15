import { getDraftParents } from 'src/features/SchemaEditor/lib/getDraftParents.ts'
import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'

export const areThereNodesUnderArray = (target: SchemaNode, node: SchemaNode) => {
  const nodeDraftParents = getDraftParents(node)
  const targetDraftParents = getDraftParents(target)

  const nodeNearestArrayParent = nodeDraftParents.find((item) => item instanceof ArrayNodeStore)

  if (!nodeNearestArrayParent) {
    return false
  }

  const foundNodeNearestArrayParentInTargetParents = targetDraftParents.find((item) => item === nodeNearestArrayParent)

  if (!foundNodeNearestArrayParentInTargetParents) {
    return true
  }

  return false
}
