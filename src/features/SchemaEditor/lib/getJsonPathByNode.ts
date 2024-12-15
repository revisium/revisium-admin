import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'

export const getSequenceByNode = (target: SchemaNode, options: { preferDraftParent: boolean }): SchemaNode[] => {
  const result: SchemaNode[] = [target]

  let node = target
  let parent = getParent(target, options?.preferDraftParent)

  while (parent) {
    result.push(parent)

    node = parent
    parent = getParent(node, options?.preferDraftParent)
  }

  return result
}

export const getJsonPathBySequence = (sequence: SchemaNode[]): string => {
  let path = ''

  let node = sequence[0]

  for (let index = 1; index < sequence.length; index++) {
    const parent = sequence[index]

    if (parent instanceof ObjectNodeStore) {
      const id = getId(node, false)
      path = `/properties/${id}${path}`
    } else if (parent instanceof ArrayNodeStore) {
      path = `/items${path}`
    }

    node = parent
  }

  return path
}

export const getJsonPathByNode = (
  target: SchemaNode,
  options: { preferDraftParent: boolean; preferDraftId: boolean; preferStartWithNotDraftId?: boolean },
): string => {
  let path = ''

  let node = target
  let parent = getParent(target, options?.preferDraftParent)

  while (parent) {
    if (parent instanceof ObjectNodeStore) {
      const id = node === target && options.preferStartWithNotDraftId ? node.id : getId(node, options?.preferDraftId)
      path = `/properties/${id}${path}`
    } else if (parent instanceof ArrayNodeStore) {
      path = `/items${path}`
    }

    node = parent
    parent = getParent(node, options?.preferDraftParent)
  }

  return path
}

const getParent = (target: SchemaNode, preferDraftParent: boolean): SchemaNode | null => {
  return preferDraftParent ? target.draftParent || target.parent : target.parent || target.draftParent
}

const getId = (target: SchemaNode, preferDraftId: boolean): string => {
  return preferDraftId ? target.draftId || target.id : target.id || target.draftId
}
