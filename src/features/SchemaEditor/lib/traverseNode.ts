import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'

export function* traverseDraftNode<T>(
  node: SchemaNode,
  callback: (node: SchemaNode) => Generator<T>,
  skipItself?: boolean,
): Generator<T> {
  if (!skipItself) {
    yield* callback(node)
  }

  if (node instanceof ObjectNodeStore) {
    for (const childNode of node.draftProperties) {
      yield* traverseDraftNode(childNode, callback)
    }
  } else if (node instanceof ArrayNodeStore) {
    yield* traverseDraftNode(node.draftItems, callback)
  }
}

export function forEachDraftNode(node: SchemaNode, callback: (node: SchemaNode) => boolean, skipItself?: boolean) {
  let result = true

  if (!skipItself) {
    result = callback(node)
  }

  if (!result) {
    return false
  }

  if (node instanceof ObjectNodeStore) {
    for (const childNode of node.draftProperties) {
      forEachDraftNode(childNode, callback)
    }
  } else if (node instanceof ArrayNodeStore) {
    forEachDraftNode(node.draftItems, callback)
  }
}
