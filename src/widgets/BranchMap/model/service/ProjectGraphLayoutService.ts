import { container } from 'src/shared/lib'
import {
  buildBranchTree,
  calculateBranchNodeX,
  calculateBranchY,
  calculateEndpointOffsets,
  calculateGraphHeight,
  calculateGraphWidth,
  calculateRevisionPositions,
  calculateSubtreeHeights,
  collectKeyRevisions,
  isDirectConnection,
  LAYOUT_CONSTANTS,
  RevisionPlacementType,
  sortKeyRevisions,
} from './projectGraphLayout.ts'
import {
  CollapsedRevisionsNodeData,
  EndpointData,
  EndpointNodeData,
  ProjectBranchNodeData,
  ProjectGraphBranch,
  ProjectGraphData,
  ProjectGraphEdge,
  ProjectGraphLayoutData,
  ProjectGraphNode,
  ProjectGraphRevision,
  RevisionNodeData,
} from '../../lib/types.ts'

type RevisionPlacement = {
  revision: ProjectGraphRevision
  branchId: string
  branchName: string
  x: number
  y: number
  type: RevisionPlacementType
}

type BranchLayout = {
  branch: ProjectGraphBranch
  row: number
  startX: number
  revisions: RevisionPlacement[]
}

export class ProjectGraphLayoutService {
  public calculateLayout(data: ProjectGraphData): ProjectGraphLayoutData {
    const nodes: ProjectGraphNode[] = []
    const edges: ProjectGraphEdge[] = []

    const branchLayouts = this.calculateBranchLayouts(data.branches)
    const revisionPositions = new Map<string, { x: number; y: number }>()

    for (const layout of branchLayouts) {
      this.addBranchNodes(nodes, edges, layout, revisionPositions)
    }

    this.addEndpointNodes(nodes, edges, revisionPositions, data.branches)

    const width = this.calculateWidth(nodes)
    const height = this.calculateHeight(nodes)

    return { nodes, edges, width, height }
  }

  private calculateBranchLayouts(branches: ProjectGraphBranch[]): BranchLayout[] {
    const layouts: BranchLayout[] = []
    const { branchByName, branchChildren } = buildBranchTree(branches)

    const rootBranch = branches.find((b) => b.isRoot)
    if (!rootBranch) {
      return layouts
    }

    const subtreeHeight = calculateSubtreeHeights(branches, branchChildren)

    const assignRows = (branchName: string, startRow: number, parentEndX: number): number => {
      const branch = branchByName.get(branchName)
      if (!branch) {
        return startRow
      }

      const layout = this.createBranchLayout(branch, startRow, parentEndX, branches)
      layouts.push(layout)

      const children = branchChildren.get(branchName) ?? []
      const childBranchesWithX = children
        .map((childName) => {
          const childBranch = branchByName.get(childName)
          if (!childBranch) {
            return null
          }
          const parentRevX = this.findParentRevisionX(layout, childBranch)
          return { childBranch, parentRevX }
        })
        .filter((item): item is { childBranch: ProjectGraphBranch; parentRevX: number } => item !== null)
        .sort((a, b) => b.parentRevX - a.parentRevX)

      let nextRow = startRow + 1
      for (const { childBranch, parentRevX } of childBranchesWithX) {
        const childSubtreeHeight = subtreeHeight.get(childBranch.name) ?? 1
        assignRows(childBranch.name, nextRow, parentRevX)
        nextRow += childSubtreeHeight
      }

      return nextRow
    }

    const { NODE_WIDTH, HORIZONTAL_GAP } = LAYOUT_CONSTANTS
    assignRows(rootBranch.name, 0, NODE_WIDTH + HORIZONTAL_GAP)

    return layouts
  }

  private findParentRevisionX(parentLayout: BranchLayout, childBranch: ProjectGraphBranch): number {
    if (!childBranch.parentRevision) {
      return parentLayout.startX
    }

    const parentRev = parentLayout.revisions.find((r) => r.revision.id === childBranch.parentRevision?.id)
    if (parentRev) {
      return parentRev.x
    }

    return parentLayout.startX
  }

  private createBranchLayout(
    branch: ProjectGraphBranch,
    row: number,
    startX: number,
    allBranches: ProjectGraphBranch[],
  ): BranchLayout {
    const y = calculateBranchY(row)
    const keyRevisions = collectKeyRevisions(branch, allBranches)
    const sortedRevisions = sortKeyRevisions(keyRevisions)
    const { positions } = calculateRevisionPositions(sortedRevisions, startX)

    const revisions: RevisionPlacement[] = sortedRevisions.map((kr) => ({
      revision: kr.rev,
      branchId: branch.id,
      branchName: branch.name,
      x: positions.get(kr.rev.id)!,
      y,
      type: kr.type,
    }))

    return { branch, row, startX, revisions }
  }

  private addBranchNodes(
    nodes: ProjectGraphNode[],
    edges: ProjectGraphEdge[],
    layout: BranchLayout,
    revisionPositions: Map<string, { x: number; y: number }>,
  ): void {
    const { branch, revisions } = layout
    const branchNodeId = `branch-${branch.id}`
    const firstRevision = revisions[0]

    if (firstRevision) {
      const branchNodeX = calculateBranchNodeX(firstRevision.x)
      const branchNodeY = firstRevision.y

      nodes.push({
        id: branchNodeId,
        type: 'branch',
        x: branchNodeX,
        y: branchNodeY,
        data: {
          branch,
          isHighlighted: false,
          isDimmed: false,
        } as ProjectBranchNodeData,
      })

      edges.push({
        id: `edge-${branchNodeId}-${firstRevision.revision.id}`,
        sourceId: branchNodeId,
        targetId: firstRevision.revision.id,
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'branch',
        isHighlighted: false,
      })

      if (!branch.isRoot && branch.parentRevision) {
        edges.push({
          id: `edge-parent-${branch.parentRevision.id}-${branchNodeId}`,
          sourceId: branch.parentRevision.id,
          targetId: branchNodeId,
          sourceHandle: 'bottom',
          targetHandle: 'top',
          type: 'parent-to-branch',
          isHighlighted: false,
        })
      }
    }

    for (const placement of revisions) {
      const nodeId = placement.revision.id
      revisionPositions.set(nodeId, { x: placement.x, y: placement.y })

      nodes.push({
        id: nodeId,
        type: 'revision',
        x: placement.x,
        y: placement.y,
        data: {
          revision: {
            id: placement.revision.id,
            comment: placement.revision.comment,
            isDraft: placement.revision.isDraft,
            isHead: placement.revision.isHead,
            isStart: placement.revision.isStart,
            createdAt: placement.revision.createdAt,
            parentId: placement.revision.parentId,
            hasEndpoints: placement.revision.endpoints.length > 0,
            endpointTypes: placement.revision.endpoints.map((e) => e.type),
            childBranchIds: placement.revision.childBranchIds,
            branchName: placement.branchName,
          },
          isHighlighted: false,
          isDimmed: false,
        } as RevisionNodeData,
      })
    }

    this.addRevisionEdges(nodes, edges, revisions, branch)
  }

  private addRevisionEdges(
    nodes: ProjectGraphNode[],
    edges: ProjectGraphEdge[],
    revisions: RevisionPlacement[],
    branch: ProjectGraphBranch,
  ): void {
    const { NODE_WIDTH, HORIZONTAL_GAP } = LAYOUT_CONSTANTS

    for (let i = 0; i < revisions.length - 1; i++) {
      const current = revisions[i]
      const next = revisions[i + 1]

      if (!isDirectConnection(current.revision, next.revision)) {
        const collapsedId = `collapsed-${branch.id}-${current.revision.id}-${next.revision.id}`
        const collapsedX = current.x + NODE_WIDTH + HORIZONTAL_GAP

        nodes.push({
          id: collapsedId,
          type: 'collapsed',
          x: collapsedX,
          y: current.y,
          data: {
            branchId: branch.id,
            count: 0,
            fromRevisionId: current.revision.id,
            toRevisionId: next.revision.id,
            isHighlighted: false,
            isDimmed: false,
          } as CollapsedRevisionsNodeData,
        })

        edges.push({
          id: `edge-${current.revision.id}-${collapsedId}`,
          sourceId: current.revision.id,
          targetId: collapsedId,
          sourceHandle: 'right',
          targetHandle: 'left',
          type: 'revision',
          isHighlighted: false,
        })

        edges.push({
          id: `edge-${collapsedId}-${next.revision.id}`,
          sourceId: collapsedId,
          targetId: next.revision.id,
          sourceHandle: 'right',
          targetHandle: 'left',
          type: 'revision',
          isHighlighted: false,
        })
      } else {
        edges.push({
          id: `edge-${current.revision.id}-${next.revision.id}`,
          sourceId: current.revision.id,
          targetId: next.revision.id,
          sourceHandle: 'right',
          targetHandle: 'left',
          type: 'revision',
          isHighlighted: false,
        })
      }
    }
  }

  private addEndpointNodes(
    nodes: ProjectGraphNode[],
    edges: ProjectGraphEdge[],
    revisionPositions: Map<string, { x: number; y: number }>,
    branches: ProjectGraphBranch[],
  ): void {
    const endpointsByRevision = this.collectEndpointsByRevision(branches)
    const { graphqlOffsetX, restOffsetX } = calculateEndpointOffsets()
    const { ENDPOINT_OFFSET_Y } = LAYOUT_CONSTANTS

    for (const [revisionId, endpoints] of endpointsByRevision) {
      const pos = revisionPositions.get(revisionId)
      if (!pos) {
        continue
      }

      const graphqlEndpoints = endpoints.filter((e) => e.type === 'GRAPHQL')
      const restEndpoints = endpoints.filter((e) => e.type === 'REST_API')

      if (graphqlEndpoints.length > 0) {
        this.addEndpointNode(
          nodes,
          edges,
          `endpoint-graphql-${revisionId}`,
          graphqlEndpoints,
          revisionId,
          pos.x + graphqlOffsetX,
          pos.y + ENDPOINT_OFFSET_Y,
          'endpoint-graphql',
        )
      }

      if (restEndpoints.length > 0) {
        this.addEndpointNode(
          nodes,
          edges,
          `endpoint-rest-${revisionId}`,
          restEndpoints,
          revisionId,
          pos.x + restOffsetX,
          pos.y + ENDPOINT_OFFSET_Y,
          'endpoint-rest',
        )
      }
    }
  }

  private collectEndpointsByRevision(branches: ProjectGraphBranch[]): Map<string, EndpointData[]> {
    const endpointsByRevision = new Map<string, EndpointData[]>()

    for (const branch of branches) {
      const allRevisions = [branch.startRevision, branch.headRevision, branch.draftRevision]
      if (branch.parentRevision) {
        allRevisions.push(branch.parentRevision)
      }

      for (const rev of allRevisions) {
        for (const endpoint of rev.endpoints) {
          const existing = endpointsByRevision.get(rev.id) ?? []
          if (!existing.some((e) => e.id === endpoint.id)) {
            existing.push(endpoint)
            endpointsByRevision.set(rev.id, existing)
          }
        }
      }
    }

    return endpointsByRevision
  }

  private addEndpointNode(
    nodes: ProjectGraphNode[],
    edges: ProjectGraphEdge[],
    nodeId: string,
    endpoints: EndpointData[],
    revisionId: string,
    x: number,
    y: number,
    edgeType: 'endpoint-graphql' | 'endpoint-rest',
  ): void {
    nodes.push({
      id: nodeId,
      type: 'endpoint',
      x,
      y,
      data: {
        endpoints,
        revisionId,
        isHighlighted: false,
        isDimmed: false,
      } as EndpointNodeData,
    })

    edges.push({
      id: `edge-${nodeId}`,
      sourceId: nodeId,
      targetId: revisionId,
      sourceHandle: 'bottom',
      targetHandle: 'top',
      type: edgeType,
      isHighlighted: false,
    })
  }

  private calculateWidth(nodes: ProjectGraphNode[]): number {
    if (nodes.length === 0) {
      return 0
    }
    const maxNodeX = Math.max(...nodes.map((n) => n.x))
    return calculateGraphWidth(maxNodeX)
  }

  private calculateHeight(nodes: ProjectGraphNode[]): number {
    if (nodes.length === 0) {
      return 0
    }
    const minY = Math.min(...nodes.map((n) => n.y))
    const maxY = Math.max(...nodes.map((n) => n.y))
    return calculateGraphHeight(minY, maxY)
  }
}

container.register(ProjectGraphLayoutService, () => new ProjectGraphLayoutService(), { scope: 'request' })
