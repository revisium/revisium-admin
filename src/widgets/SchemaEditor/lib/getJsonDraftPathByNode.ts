import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'

export const getJsonDraftPathByNode = (target: SchemaNode, useNotDraftIdFromTarget: boolean = false): string => {
  let path = ''

  let node: SchemaNode = target

  while (node.draftParent) {
    if (node.draftParent instanceof ObjectNodeStore) {
      const id = node === target && useNotDraftIdFromTarget ? node.id : node.draftId
      path = `/properties/${id}${path}`
    } else if (node.draftParent instanceof ArrayNodeStore) {
      path = `/items${path}`
    }

    node = node.draftParent
  }

  return path
}
