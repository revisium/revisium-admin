import {
  JsonPatch,
  JsonPatchAddOperation,
  JsonPatchMoveOperation,
  JsonPatchRemoveOperation,
  JsonPatchReplaceOperation,
} from 'src/entities/Schema/types/json-patch.types.ts'
import { forEachDraftNode, traverseDraftNode } from 'src/widgets/SchemaEditor/lib/traverseNode.ts'
import {
  getJsonPathByNode,
  getSequenceByNode,
  getJsonPathBySequence,
} from 'src/widgets/SchemaEditor/lib/getJsonPathByNode.ts'
import { NodeStoreType, SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'

type StackItemAdd = {
  op: JsonPatchAddOperation
  node: SchemaNode
  sequence: SchemaNode[]
}

type StackItemRemove = {
  op: JsonPatchRemoveOperation
  node: SchemaNode
  sequence: SchemaNode[]
}

type StackItemReplace = {
  op: JsonPatchReplaceOperation
  node: SchemaNode
  sequence: SchemaNode[]
}

type StackItemMove = {
  op: JsonPatchMoveOperation
  node: SchemaNode
  fromSequence: SchemaNode[]
  toSequence: SchemaNode[]
}

type StackItem = StackItemAdd | StackItemRemove | StackItemReplace | StackItemMove

export class NodeHistory {
  private readonly stack: StackItem[] = []
  private readonly setIdMap = new Set<string>()

  constructor() {}

  public add(node: SchemaNode): void {
    this.stack.push({
      node,
      op: 'add',
      sequence: getSequenceByNode(node, { preferDraftParent: true }),
    })
  }

  public remove(node: SchemaNode): void {
    const isThereJustAddedNodeIndex = this.stack.findIndex((item) => item.node === node && item.op === 'add')

    this.deepRemovePatches(node)

    if (isThereJustAddedNodeIndex === -1) {
      this.stack.push({
        node,
        op: 'remove',
        sequence: getSequenceByNode(node, { preferDraftParent: true }),
      })
    }
  }

  public replace(previousProperty: SchemaNode, nextProperty: SchemaNode): void {
    if (this.checkIfStringOrRefDuplicationInReplace(nextProperty)) {
      return
    }

    const isThereJustAddedNodeIndex = this.stack.findIndex(
      (item) => item.node.nodeId === nextProperty.nodeId && item.op === 'add',
    )

    if (isThereJustAddedNodeIndex !== -1) {
      this.deepRemovePatches(previousProperty, false)
      this.stack.push({
        node: nextProperty,
        op: 'add',
        sequence: getSequenceByNode(nextProperty, { preferDraftParent: true }),
      })
    } else {
      this.deepRemovePatches(previousProperty, true)
      this.stack.push({
        node: nextProperty,
        op: 'replace',
        sequence: getSequenceByNode(nextProperty, { preferDraftParent: true }),
      })
    }
  }

  public move(node: SchemaNode): void {
    const foundPreviousMoveIndex = this.stack.findIndex((item) => item.node === node && item.op === 'move')

    if (foundPreviousMoveIndex !== -1) {
      this.stack.splice(foundPreviousMoveIndex, 1)
    }

    const isReturnedToParent = node.parent === node.draftParent && node.id === node.draftId

    if (!isReturnedToParent) {
      this.stack.push({
        node,
        op: 'move',
        fromSequence: getSequenceByNode(node, { preferDraftParent: false }),
        toSequence: getSequenceByNode(node, { preferDraftParent: true }),
      })
    }
  }

  public reset(): void {
    this.stack.length = 0
    this.setIdMap.clear()
  }

  public getPatches(root: SchemaNode): JsonPatch[] {
    return [...this.getStackPatches(), ...this.getMoveIdPatches(root)]
  }

  public setId(node: SchemaNode) {
    this.setIdMap.add(node.nodeId)
  }

  private getMoveIdPatches(root): JsonPatch[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    return [
      ...traverseDraftNode(root, function* iterNode(node: SchemaNode): Generator<JsonPatch> {
        if (self.setIdMap.has(node.nodeId) && node.draftParent instanceof ObjectNodeStore) {
          yield {
            op: 'move',
            from: getJsonPathByNode(node, {
              preferDraftParent: true,
              preferDraftId: true,
              preferStartWithNotDraftId: true,
            }),
            path: getJsonPathByNode(node, { preferDraftParent: true, preferDraftId: true }),
          }
        }
      }),
    ]
  }

  private getStackPatches(): JsonPatch[] {
    return this.stack.map((item) => {
      switch (item.op) {
        case 'add':
          return {
            op: 'add',
            path: getJsonPathBySequence(item.sequence),
            value: item.node.getSchema({ skipMovedBetweenParentsNodes: true }),
          }
        case 'replace':
          return {
            op: 'replace',
            path: getJsonPathBySequence(item.sequence),
            value: item.node.getSchema({ skipMovedBetweenParentsNodes: true }),
          }
        case 'remove':
          return {
            op: 'remove',
            path: getJsonPathBySequence(item.sequence),
          }
        case 'move':
          return {
            op: 'move',
            from: getJsonPathBySequence(item.fromSequence),
            path: getJsonPathBySequence(item.toSequence),
          }
      }
    })
  }

  private checkIfStringOrRefDuplicationInReplace(node: SchemaNode): boolean {
    if (node.type === NodeStoreType.String || node.$ref) {
      const foundDuplication = this.stack.find((item) => item.node === node)

      if (foundDuplication) {
        return true
      }
    }

    return false
  }

  private deepRemovePatches(node: SchemaNode, skipItself?: boolean): void {
    forEachDraftNode(
      node,
      (iterNode: SchemaNode) => {
        let isThereNode = this.stack.findIndex((item) => item.node.nodeId === iterNode.nodeId && item.op !== 'move')

        while (isThereNode !== -1) {
          this.stack.splice(isThereNode, 1)
          isThereNode = this.stack.findIndex((item) => item.node.nodeId === iterNode.nodeId && item.op !== 'move')
        }

        const isMovedIndex = this.stack.findIndex((item) => item.node.nodeId === iterNode.nodeId && item.op === 'move')

        if (isMovedIndex !== -1) {
          this.stack.splice(isMovedIndex, 1, {
            node: iterNode,
            op: 'remove',
            sequence: getSequenceByNode(iterNode, { preferDraftParent: false }),
          })

          this.deepRemovePatches(iterNode, true)

          return false
        } else {
          return true
        }
      },
      skipItself,
    )
  }
}
