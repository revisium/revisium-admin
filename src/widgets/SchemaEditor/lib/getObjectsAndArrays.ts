import { traverseDraftNode } from 'src/widgets/SchemaEditor/lib/traverseNode.ts'
import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'

export const getObjectsAndArrays = (root: SchemaNode): (ObjectNodeStore | ArrayNodeStore)[] => {
  return [
    ...traverseDraftNode(root, function* (node) {
      if (node instanceof ObjectNodeStore || node instanceof ArrayNodeStore) {
        yield node
      }
    }),
  ]
}
