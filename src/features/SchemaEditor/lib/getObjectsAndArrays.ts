import { traverseDraftNode } from 'src/features/SchemaEditor/lib/traverseNode.ts'
import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'

export const getObjectsAndArrays = (root: SchemaNode): (ObjectNodeStore | ArrayNodeStore)[] => {
  return [
    ...traverseDraftNode(root, function* (node) {
      if (node instanceof ObjectNodeStore || node instanceof ArrayNodeStore) {
        yield node
      }
    }),
  ]
}
