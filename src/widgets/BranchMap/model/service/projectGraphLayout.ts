import { ProjectGraphBranch, ProjectGraphRevision } from '../../lib/types.ts'

export type RevisionPlacementType = 'start' | 'head' | 'draft' | 'parent' | 'endpoint-source'

export type KeyRevision = {
  rev: ProjectGraphRevision
  type: RevisionPlacementType
}

export const LAYOUT_CONSTANTS = {
  NODE_WIDTH: 120,
  NODE_HEIGHT: 50,
  HORIZONTAL_GAP: 60,
  VERTICAL_GAP: 100,
  BRANCH_VERTICAL_GAP: 140,
  ENDPOINT_OFFSET_Y: -90,
  ENDPOINT_CARD_WIDTH: 70,
  ENDPOINT_CARD_GAP: 10,
} as const

export function buildBranchTree(branches: ProjectGraphBranch[]): {
  branchByName: Map<string, ProjectGraphBranch>
  branchChildren: Map<string, string[]>
} {
  const branchByName = new Map<string, ProjectGraphBranch>()
  const branchChildren = new Map<string, string[]>()

  for (const branch of branches) {
    branchByName.set(branch.name, branch)
    if (branch.parentBranchName) {
      const children = branchChildren.get(branch.parentBranchName) ?? []
      children.push(branch.name)
      branchChildren.set(branch.parentBranchName, children)
    }
  }

  return { branchByName, branchChildren }
}

export function calculateSubtreeHeights(
  branches: ProjectGraphBranch[],
  branchChildren: Map<string, string[]>,
): Map<string, number> {
  const subtreeHeight = new Map<string, number>()

  const calculate = (branchName: string): number => {
    if (subtreeHeight.has(branchName)) {
      return subtreeHeight.get(branchName)!
    }

    const children = branchChildren.get(branchName) ?? []
    if (children.length === 0) {
      subtreeHeight.set(branchName, 1)
      return 1
    }

    let totalChildrenHeight = 0
    for (const childName of children) {
      totalChildrenHeight += calculate(childName)
    }

    const height = 1 + totalChildrenHeight
    subtreeHeight.set(branchName, height)
    return height
  }

  for (const branch of branches) {
    calculate(branch.name)
  }

  return subtreeHeight
}

export function collectKeyRevisions(branch: ProjectGraphBranch, allBranches: ProjectGraphBranch[]): KeyRevision[] {
  const keyRevisions: KeyRevision[] = []
  const addedIds = new Set<string>()

  // 1. Start revision (always first)
  if (!addedIds.has(branch.startRevision.id)) {
    keyRevisions.push({ rev: branch.startRevision, type: 'start' })
    addedIds.add(branch.startRevision.id)
  }

  // 2. Parent revisions for child branches
  const childBranches = allBranches.filter((b) => b.parentBranchId === branch.id)
  for (const childBranch of childBranches) {
    if (childBranch.parentRevision && !addedIds.has(childBranch.parentRevision.id)) {
      keyRevisions.push({ rev: childBranch.parentRevision, type: 'parent' })
      addedIds.add(childBranch.parentRevision.id)
    }
  }

  // 3. Revisions with endpoints
  const allRevisions = [branch.startRevision, branch.headRevision, branch.draftRevision]
  for (const rev of allRevisions) {
    if (rev.endpoints.length > 0 && !addedIds.has(rev.id)) {
      keyRevisions.push({ rev, type: 'endpoint-source' })
      addedIds.add(rev.id)
    }
  }

  // 4. Head revision
  if (!addedIds.has(branch.headRevision.id)) {
    keyRevisions.push({ rev: branch.headRevision, type: 'head' })
    addedIds.add(branch.headRevision.id)
  }

  // 5. Draft revision (if different from head)
  if (!addedIds.has(branch.draftRevision.id)) {
    keyRevisions.push({ rev: branch.draftRevision, type: 'draft' })
    addedIds.add(branch.draftRevision.id)
  }

  return keyRevisions
}

export function sortKeyRevisions(keyRevisions: KeyRevision[]): KeyRevision[] {
  // Topological sort based on parentId chain
  const sorted: KeyRevision[] = []
  const visited = new Set<string>()

  // Find the starting point (revision with no parent in our set, or type 'start')
  const startRevision = keyRevisions.find((kr) => kr.type === 'start')
  if (!startRevision) {
    // Fallback to original type-based sort if no start
    const order: Record<RevisionPlacementType, number> = {
      start: 0,
      parent: 1,
      'endpoint-source': 2,
      head: 3,
      draft: 4,
    }
    return [...keyRevisions].sort((a, b) => order[a.type] - order[b.type])
  }

  // Build child map: parentId -> children
  const childrenOf = new Map<string, KeyRevision[]>()
  for (const kr of keyRevisions) {
    if (kr.rev.parentId) {
      const children = childrenOf.get(kr.rev.parentId) ?? []
      children.push(kr)
      childrenOf.set(kr.rev.parentId, children)
    }
  }

  // BFS from start revision, following parent-child chain
  const queue: KeyRevision[] = [startRevision]
  while (queue.length > 0) {
    const current = queue.shift()!
    if (visited.has(current.rev.id)) {
      continue
    }
    visited.add(current.rev.id)
    sorted.push(current)

    // Add children in order (prefer head over draft, etc.)
    const children = childrenOf.get(current.rev.id) ?? []
    const typeOrder: Record<RevisionPlacementType, number> = {
      start: 0,
      parent: 1,
      'endpoint-source': 2,
      head: 3,
      draft: 4,
    }
    children.sort((a, b) => typeOrder[a.type] - typeOrder[b.type])
    queue.push(...children)
  }

  // Add any remaining revisions that weren't reachable from start (e.g., parent revisions from other branches)
  for (const kr of keyRevisions) {
    if (!visited.has(kr.rev.id)) {
      sorted.push(kr)
    }
  }

  return sorted
}

export function isDirectConnection(currentRev: ProjectGraphRevision, nextRev: ProjectGraphRevision): boolean {
  return nextRev.parentId === currentRev.id
}

export function calculateRevisionPositions(
  keyRevisions: KeyRevision[],
  startX: number,
): { positions: Map<string, number>; totalWidth: number } {
  const positions = new Map<string, number>()
  const { NODE_WIDTH, HORIZONTAL_GAP } = LAYOUT_CONSTANTS

  let currentX = startX

  for (let i = 0; i < keyRevisions.length; i++) {
    const { rev } = keyRevisions[i]
    positions.set(rev.id, currentX)
    currentX += NODE_WIDTH + HORIZONTAL_GAP

    // Add space for collapsed node if next revision is not a direct child
    if (i < keyRevisions.length - 1) {
      const nextRev = keyRevisions[i + 1].rev
      if (!isDirectConnection(rev, nextRev)) {
        currentX += NODE_WIDTH + HORIZONTAL_GAP
      }
    }
  }

  return { positions, totalWidth: currentX - startX }
}

export function calculateBranchY(row: number): number {
  return row * LAYOUT_CONSTANTS.BRANCH_VERTICAL_GAP + LAYOUT_CONSTANTS.VERTICAL_GAP
}

export function calculateBranchNodeX(firstRevisionX: number): number {
  return firstRevisionX - LAYOUT_CONSTANTS.NODE_WIDTH - LAYOUT_CONSTANTS.HORIZONTAL_GAP
}

export function calculateEndpointOffsets(): { graphqlOffsetX: number; restOffsetX: number } {
  const { ENDPOINT_CARD_WIDTH, ENDPOINT_CARD_GAP } = LAYOUT_CONSTANTS
  return {
    graphqlOffsetX: -((ENDPOINT_CARD_WIDTH + ENDPOINT_CARD_GAP) / 2),
    restOffsetX: (ENDPOINT_CARD_WIDTH + ENDPOINT_CARD_GAP) / 2,
  }
}

export function calculateGraphWidth(maxNodeX: number): number {
  const { NODE_WIDTH, HORIZONTAL_GAP } = LAYOUT_CONSTANTS
  return maxNodeX + NODE_WIDTH + HORIZONTAL_GAP * 2
}

export function calculateGraphHeight(minY: number, maxY: number): number {
  const { NODE_HEIGHT, VERTICAL_GAP } = LAYOUT_CONSTANTS
  return maxY - minY + NODE_HEIGHT + VERTICAL_GAP * 2
}
