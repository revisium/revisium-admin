import { container } from 'src/shared/lib'
import { extractForeignKeys } from './extractForeignKeys.ts'
import { GraphData, LayoutData, LayoutNode, RelationEdge, TableNode, TableWithSchema } from './types.ts'

const NODE_WIDTH = 180
const NODE_HEIGHT = 80
const HORIZONTAL_GAP = 100
const VERTICAL_GAP = 60
const CURVE_BASE_OFFSET = 20

export class TableRelationsLayoutService {
  public buildGraph(tables: TableWithSchema[]): GraphData {
    const tableMap = new Map(tables.map((t) => [t.id, t]))
    const edges = this.buildEdges(tables, tableMap)
    const { incomingMap, outgoingMap } = this.buildEdgeMaps(tableMap, edges)
    const nodes = this.buildNodes(tables, incomingMap, outgoingMap)

    return { nodes, edges }
  }

  public calculateLayout(graphData: GraphData): LayoutData {
    const { nodes, edges } = graphData

    if (nodes.length === 0) {
      return { nodes: [], edges: [], width: 0, height: 0 }
    }

    const layers = this.assignLayers(nodes, edges)
    const orderedLayers = this.orderNodesInLayers(layers, edges)
    const layoutNodes = this.assignCoordinates(orderedLayers, nodes)

    return {
      nodes: layoutNodes,
      edges,
      width: this.calculateGraphWidth(layoutNodes),
      height: this.calculateGraphHeight(layoutNodes),
    }
  }

  private buildEdges(tables: TableWithSchema[], tableMap: Map<string, TableWithSchema>): RelationEdge[] {
    const edges: RelationEdge[] = []
    const pairEdgeCount = new Map<string, number>()

    for (const table of tables) {
      const foreignKeys = extractForeignKeys(table.schema)

      for (const fk of foreignKeys) {
        if (!tableMap.has(fk.targetTableId)) {
          continue
        }

        const pairKey = this.makePairKey(table.id, fk.targetTableId)
        const currentCount = pairEdgeCount.get(pairKey) ?? 0
        pairEdgeCount.set(pairKey, currentCount + 1)

        edges.push({
          id: `${table.id}-${fk.fieldPath}-${fk.targetTableId}`,
          sourceTableId: table.id,
          targetTableId: fk.targetTableId,
          fieldPath: fk.fieldPath,
          curveOffset: this.calculateCurveOffset(currentCount),
        })
      }
    }

    return edges
  }

  private buildEdgeMaps(
    tableMap: Map<string, TableWithSchema>,
    edges: RelationEdge[],
  ): { incomingMap: Map<string, RelationEdge[]>; outgoingMap: Map<string, RelationEdge[]> } {
    const incomingMap = new Map<string, RelationEdge[]>()
    const outgoingMap = new Map<string, RelationEdge[]>()

    for (const tableId of tableMap.keys()) {
      incomingMap.set(tableId, [])
      outgoingMap.set(tableId, [])
    }

    for (const edge of edges) {
      outgoingMap.get(edge.sourceTableId)?.push(edge)
      incomingMap.get(edge.targetTableId)?.push(edge)
    }

    return { incomingMap, outgoingMap }
  }

  private buildNodes(
    tables: TableWithSchema[],
    incomingMap: Map<string, RelationEdge[]>,
    outgoingMap: Map<string, RelationEdge[]>,
  ): TableNode[] {
    return tables.map((table) => ({
      id: table.id,
      fieldsCount: Object.keys(table.schema.properties).length,
      rowsCount: table.count,
      incomingEdges: incomingMap.get(table.id) ?? [],
      outgoingEdges: outgoingMap.get(table.id) ?? [],
    }))
  }

  private makePairKey(tableA: string, tableB: string): string {
    return [tableA, tableB].sort().join('::')
  }

  private calculateCurveOffset(edgeIndex: number): number {
    if (edgeIndex === 0) {
      return 0
    }
    const direction = edgeIndex % 2 === 1 ? 1 : -1
    const magnitude = Math.ceil(edgeIndex / 2)
    return direction * magnitude * CURVE_BASE_OFFSET
  }

  private calculateGraphWidth(layoutNodes: LayoutNode[]): number {
    return Math.max(...layoutNodes.map((n) => n.x)) + NODE_WIDTH
  }

  private calculateGraphHeight(layoutNodes: LayoutNode[]): number {
    return Math.max(...layoutNodes.map((n) => n.y)) + NODE_HEIGHT
  }

  private assignLayers(nodes: TableNode[], edges: RelationEdge[]): Map<number, string[]> {
    const { inDegree, outEdges } = this.buildDegreesMaps(nodes, edges)
    const { layers, nodeLayer } = this.initializeLayers(nodes, inDegree)

    this.propagateLayers(layers, nodeLayer, outEdges)
    this.assignOrphanNodes(nodes, layers, nodeLayer)

    return layers
  }

  private buildDegreesMaps(
    nodes: TableNode[],
    edges: RelationEdge[],
  ): { inDegree: Map<string, number>; outEdges: Map<string, string[]> } {
    const inDegree = new Map<string, number>()
    const outEdges = new Map<string, string[]>()

    for (const node of nodes) {
      inDegree.set(node.id, 0)
      outEdges.set(node.id, [])
    }

    for (const edge of edges) {
      const current = inDegree.get(edge.targetTableId) ?? 0
      inDegree.set(edge.targetTableId, current + 1)
      outEdges.get(edge.sourceTableId)?.push(edge.targetTableId)
    }

    return { inDegree, outEdges }
  }

  private initializeLayers(
    nodes: TableNode[],
    inDegree: Map<string, number>,
  ): { layers: Map<number, string[]>; nodeLayer: Map<string, number>; queue: string[] } {
    const layers = new Map<number, string[]>()
    const nodeLayer = new Map<string, number>()
    const queue: string[] = []

    for (const [nodeId, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(nodeId)
        nodeLayer.set(nodeId, 0)
      }
    }

    if (queue.length === 0 && nodes.length > 0) {
      queue.push(nodes[0].id)
      nodeLayer.set(nodes[0].id, 0)
    }

    return { layers, nodeLayer, queue }
  }

  private propagateLayers(
    layers: Map<number, string[]>,
    nodeLayer: Map<string, number>,
    outEdges: Map<string, string[]>,
  ): void {
    const queue = Array.from(nodeLayer.keys())

    while (queue.length > 0) {
      const current = queue.shift()
      if (!current) {
        continue
      }

      const layer = nodeLayer.get(current) ?? 0

      if (!layers.has(layer)) {
        layers.set(layer, [])
      }
      layers.get(layer)?.push(current)

      const neighbors = outEdges.get(current) ?? []
      for (const neighbor of neighbors) {
        if (!nodeLayer.has(neighbor)) {
          nodeLayer.set(neighbor, layer + 1)
          queue.push(neighbor)
        }
      }
    }
  }

  private assignOrphanNodes(nodes: TableNode[], layers: Map<number, string[]>, nodeLayer: Map<string, number>): void {
    for (const node of nodes) {
      if (!nodeLayer.has(node.id)) {
        const maxLayer = Math.max(...Array.from(layers.keys()), -1) + 1
        if (!layers.has(maxLayer)) {
          layers.set(maxLayer, [])
        }
        layers.get(maxLayer)?.push(node.id)
        nodeLayer.set(node.id, maxLayer)
      }
    }
  }

  private orderNodesInLayers(layers: Map<number, string[]>, edges: RelationEdge[]): Map<number, string[]> {
    const edgeTargets = this.buildEdgeTargetsMap(edges)
    const sortedLayers = Array.from(layers.keys()).sort((a, b) => a - b)

    for (let i = 1; i < sortedLayers.length; i++) {
      const layerIndex = sortedLayers[i]
      const currentLayer = layers.get(layerIndex) ?? []
      const previousLayer = layers.get(sortedLayers[i - 1]) ?? []

      const sortedLayer = this.sortLayerByConnections(currentLayer, previousLayer, edgeTargets)
      layers.set(layerIndex, sortedLayer)
    }

    return layers
  }

  private buildEdgeTargetsMap(edges: RelationEdge[]): Map<string, Set<string>> {
    const edgeTargets = new Map<string, Set<string>>()

    for (const edge of edges) {
      if (!edgeTargets.has(edge.sourceTableId)) {
        edgeTargets.set(edge.sourceTableId, new Set())
      }
      edgeTargets.get(edge.sourceTableId)?.add(edge.targetTableId)
    }

    return edgeTargets
  }

  private sortLayerByConnections(
    currentLayer: string[],
    previousLayer: string[],
    edgeTargets: Map<string, Set<string>>,
  ): string[] {
    return [...currentLayer].sort((a, b) => {
      const aConnections = previousLayer.filter((prev) => edgeTargets.get(prev)?.has(a)).length
      const bConnections = previousLayer.filter((prev) => edgeTargets.get(prev)?.has(b)).length
      return bConnections - aConnections
    })
  }

  private assignCoordinates(layers: Map<number, string[]>, nodes: TableNode[]): LayoutNode[] {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]))
    const layoutNodes: LayoutNode[] = []
    const sortedLayerIndices = Array.from(layers.keys()).sort((a, b) => a - b)

    for (const layerIndex of sortedLayerIndices) {
      const layerNodes = layers.get(layerIndex) ?? []

      for (let row = 0; row < layerNodes.length; row++) {
        const node = nodeMap.get(layerNodes[row])

        if (node) {
          layoutNodes.push({
            ...node,
            x: layerIndex * (NODE_WIDTH + HORIZONTAL_GAP),
            y: row * (NODE_HEIGHT + VERTICAL_GAP),
            column: layerIndex,
            row,
          })
        }
      }
    }

    return layoutNodes
  }
}

container.register(TableRelationsLayoutService, () => new TableRelationsLayoutService(), { scope: 'request' })
