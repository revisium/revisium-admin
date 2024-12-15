import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'

export const getDraftParents = (node: SchemaNode): SchemaNode[] => {
  const result: SchemaNode[] = []

  let draftParent = node.draftParent

  while (draftParent) {
    result.push(draftParent)

    draftParent = draftParent.draftParent
  }

  return result
}
