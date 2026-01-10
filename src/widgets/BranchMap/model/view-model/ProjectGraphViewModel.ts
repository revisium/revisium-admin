import { applyNodeChanges, Edge, Node, NodeChange } from '@xyflow/react'
import { makeAutoObservable, runInAction } from 'mobx'
import { NavigateFunction } from 'react-router-dom'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { APP_ROUTE, DRAFT_TAG, ENDPOINTS_ROUTE } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { BranchMapFullscreenService } from '../../lib/FullscreenService.ts'
import {
  CollapsedRevisionsNodeData,
  EndpointNodeData,
  ProjectBranchNodeData,
  ProjectGraphData,
  RevisionNodeData,
} from '../../lib/types.ts'
import { BranchMapDataSource } from '../data-source/BranchMapDataSource.ts'
import { ProjectGraphLayoutService } from '../service/ProjectGraphLayoutService.ts'
import { CollapsedNodeViewModel } from './CollapsedNodeViewModel.ts'
import { EndpointNodeViewModel } from './EndpointNodeViewModel.ts'
import {
  CollapsedNodeViewModelFactory,
  EndpointNodeViewModelFactory,
  ProjectBranchNodeViewModelFactory,
  RevisionEdgeViewModelFactory,
  RevisionNodeViewModelFactory,
} from './factories.ts'
import { ProjectBranchNodeViewModel } from './ProjectBranchNodeViewModel.ts'
import { RevisionEdgeViewModel } from './RevisionEdgeViewModel.ts'
import { RevisionNodeViewModel } from './RevisionNodeViewModel.ts'

enum State {
  loading = 'loading',
  empty = 'empty',
  graph = 'graph',
  error = 'error',
}

export class ProjectGraphViewModel {
  private _state: State = State.loading
  private _graphData: ProjectGraphData | null = null
  private _navigate: NavigateFunction | null = null

  private _branchNodes: ProjectBranchNodeViewModel[] = []
  private _revisionNodes: RevisionNodeViewModel[] = []
  private _collapsedNodes: CollapsedNodeViewModel[] = []
  private _endpointNodes: EndpointNodeViewModel[] = []
  private _edgeViewModels: RevisionEdgeViewModel[] = []

  private _hoveredNodeId: string | null = null
  private _selectedNodeId: string | null = null

  private _reactFlowNodes: Node[] = []
  private _reactFlowEdges: Edge[] = []
  private _dataVersion = 0

  constructor(
    private readonly context: ProjectContext,
    private readonly dataSource: BranchMapDataSource,
    private readonly layoutService: ProjectGraphLayoutService,
    public readonly fullscreen: BranchMapFullscreenService,
    private readonly branchNodeFactory: ProjectBranchNodeViewModelFactory,
    private readonly revisionNodeFactory: RevisionNodeViewModelFactory,
    private readonly collapsedNodeFactory: CollapsedNodeViewModelFactory,
    private readonly endpointNodeFactory: EndpointNodeViewModelFactory,
    private readonly edgeFactory: RevisionEdgeViewModelFactory,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoading(): boolean {
    return this._state === State.loading
  }

  public get isEmpty(): boolean {
    return this._state === State.empty
  }

  public get isError(): boolean {
    return this._state === State.error
  }

  public get showGraph(): boolean {
    return this._state === State.graph
  }

  public get reactFlowNodes(): Node[] {
    return this._reactFlowNodes
  }

  public get reactFlowEdges(): Edge[] {
    return this._reactFlowEdges
  }

  public get dataVersion(): number {
    return this._dataVersion
  }

  public get projectName(): string {
    return this.context.projectName
  }

  public get branchesCount(): number {
    return this._graphData?.branches.length ?? 0
  }

  public get endpointsCount(): number {
    return this._endpointNodes.length
  }

  private get hasHighlight(): boolean {
    return this._hoveredNodeId !== null || this._selectedNodeId !== null
  }

  public init(navigate: NavigateFunction): void {
    this._navigate = navigate
    this.fullscreen.init()
    void this.load()
  }

  public dispose(): void {
    this.dataSource.dispose()
    this.fullscreen.dispose()
  }

  public setHoveredNode(nodeId: string | null): void {
    if (this._hoveredNodeId !== nodeId) {
      this._hoveredNodeId = nodeId
      this.updateHighlightState()
    }
  }

  public setSelectedNode(nodeId: string | null): void {
    if (this._selectedNodeId !== nodeId) {
      this._selectedNodeId = nodeId
      this.updateHighlightState()
    }
  }

  public clearSelection(): void {
    if (this._selectedNodeId !== null) {
      this._selectedNodeId = null
      this.updateHighlightState()
    }
  }

  public handleNodesChange(changes: NodeChange[]): void {
    this._reactFlowNodes = applyNodeChanges(changes, this._reactFlowNodes)
  }

  public navigateToRevision(revisionId: string, branchName: string, tag?: string): void {
    if (!this._navigate) {
      return
    }
    const revisionIdOrTag = tag ?? revisionId
    const path = `/${APP_ROUTE}/${this.context.organizationId}/${this.context.projectName}/${branchName}/${revisionIdOrTag}`
    this._navigate(path)
  }

  public navigateToBranch(branchName: string): void {
    if (!this._navigate) {
      return
    }
    const path = `/${APP_ROUTE}/${this.context.organizationId}/${this.context.projectName}/${branchName}/${DRAFT_TAG}`
    this._navigate(path)
  }

  public navigateToEndpoints(): void {
    if (!this._navigate) {
      return
    }
    const path = `/${APP_ROUTE}/${this.context.organizationId}/${this.context.projectName}/${ENDPOINTS_ROUTE}`
    this._navigate(path)
  }

  private async load(): Promise<void> {
    runInAction(() => {
      this._state = State.loading
    })

    const result = await this.dataSource.loadProjectGraph(this.context.organizationId, this.context.projectName)

    if (result.aborted) {
      return
    }

    if (!result.data) {
      runInAction(() => {
        this._state = State.error
      })
      return
    }

    runInAction(() => {
      this._graphData = result.data

      if (result.data!.branches.length === 0) {
        this._state = State.empty
        return
      }

      this.buildLayout()
      this._state = State.graph
    })
  }

  private buildLayout(): void {
    if (!this._graphData) {
      return
    }

    const layout = this.layoutService.calculateLayout(this._graphData)

    this._branchNodes = []
    this._revisionNodes = []
    this._collapsedNodes = []
    this._endpointNodes = []

    for (const node of layout.nodes) {
      if (node.type === 'branch') {
        const data = node.data as ProjectBranchNodeData
        this._branchNodes.push(this.branchNodeFactory.create(data.branch, node.x, node.y))
      } else if (node.type === 'revision') {
        const data = node.data as RevisionNodeData
        this._revisionNodes.push(this.revisionNodeFactory.create(data.revision, node.x, node.y))
      } else if (node.type === 'collapsed') {
        const data = node.data as CollapsedRevisionsNodeData
        this._collapsedNodes.push(this.collapsedNodeFactory.create({ id: node.id, ...data }, node.x, node.y))
      } else if (node.type === 'endpoint') {
        const data = node.data as EndpointNodeData
        this._endpointNodes.push(
          this.endpointNodeFactory.create(node.id, data.endpoints, data.revisionId, node.x, node.y),
        )
      }
    }

    this._edgeViewModels = layout.edges.map((edge) => this.edgeFactory.create(edge))

    this.buildReactFlowData()
  }

  private buildReactFlowData(): void {
    const nodes: Node[] = []

    for (const node of this._branchNodes) {
      nodes.push({
        id: node.id,
        type: 'branchNode',
        position: { x: node.x, y: node.y },
        data: {
          model: node,
          onMouseEnter: this.setHoveredNode,
          onMouseLeave: () => this.setHoveredNode(null),
          onClick: this.setSelectedNode,
          onNavigate: this.navigateToBranch,
        },
      })
    }

    for (const node of this._revisionNodes) {
      nodes.push({
        id: node.id,
        type: 'revisionNode',
        position: { x: node.x, y: node.y },
        data: {
          model: node,
          onMouseEnter: this.setHoveredNode,
          onMouseLeave: () => this.setHoveredNode(null),
          onClick: this.setSelectedNode,
          onNavigate: this.navigateToRevision,
        },
      })
    }

    for (const node of this._collapsedNodes) {
      nodes.push({
        id: node.id,
        type: 'collapsedNode',
        position: { x: node.x, y: node.y },
        data: {
          model: node,
          onMouseEnter: this.setHoveredNode,
          onMouseLeave: () => this.setHoveredNode(null),
          onClick: this.setSelectedNode,
        },
      })
    }

    for (const node of this._endpointNodes) {
      nodes.push({
        id: node.id,
        type: 'endpointNode',
        position: { x: node.x, y: node.y },
        data: {
          model: node,
          onMouseEnter: this.setHoveredNode,
          onMouseLeave: () => this.setHoveredNode(null),
          onClick: this.setSelectedNode,
          onNavigateToEndpoints: this.navigateToEndpoints,
        },
      })
    }

    const edges: Edge[] = this._edgeViewModels.map((edge) => ({
      id: edge.id,
      source: edge.sourceId,
      target: edge.targetId,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: 'revisionEdge',
      data: { model: edge },
    }))

    this._reactFlowNodes = nodes
    this._reactFlowEdges = edges
    this._dataVersion++
  }

  private updateHighlightState(): void {
    const hasHighlight = this.hasHighlight

    for (const node of this._branchNodes) {
      const isHighlighted = this.isNodeHighlighted(node.id)
      node.setHighlighted(isHighlighted)
      node.setDimmed(hasHighlight && !isHighlighted)
    }

    for (const node of this._revisionNodes) {
      const isHighlighted = this.isNodeHighlighted(node.id)
      node.setHighlighted(isHighlighted)
      node.setDimmed(hasHighlight && !isHighlighted)
    }

    for (const node of this._collapsedNodes) {
      const isHighlighted = this.isNodeHighlighted(node.id)
      node.setHighlighted(isHighlighted)
      node.setDimmed(hasHighlight && !isHighlighted)
    }

    for (const node of this._endpointNodes) {
      const isHighlighted = this.isNodeHighlighted(node.id)
      node.setHighlighted(isHighlighted)
      node.setDimmed(hasHighlight && !isHighlighted)
    }

    for (const edge of this._edgeViewModels) {
      edge.setHighlighted(this.isEdgeHighlighted(edge))
    }
  }

  private isNodeHighlighted(nodeId: string): boolean {
    const targetId = this._hoveredNodeId ?? this._selectedNodeId
    if (!targetId) {
      return false
    }

    if (nodeId === targetId) {
      return true
    }

    // Check connected edges
    for (const edge of this._edgeViewModels) {
      if (edge.sourceId === targetId && edge.targetId === nodeId) {
        return true
      }
      if (edge.targetId === targetId && edge.sourceId === nodeId) {
        return true
      }
    }

    return false
  }

  private isEdgeHighlighted(edge: RevisionEdgeViewModel): boolean {
    const targetId = this._hoveredNodeId ?? this._selectedNodeId
    if (!targetId) {
      return false
    }
    return edge.sourceId === targetId || edge.targetId === targetId
  }
}

container.register(
  ProjectGraphViewModel,
  () => {
    const context = container.get(ProjectContext)
    const dataSource = container.get(BranchMapDataSource)
    const layoutService = container.get(ProjectGraphLayoutService)
    const fullscreen = container.get(BranchMapFullscreenService)
    const branchNodeFactory = container.get(ProjectBranchNodeViewModelFactory)
    const revisionNodeFactory = container.get(RevisionNodeViewModelFactory)
    const collapsedNodeFactory = container.get(CollapsedNodeViewModelFactory)
    const endpointNodeFactory = container.get(EndpointNodeViewModelFactory)
    const edgeFactory = container.get(RevisionEdgeViewModelFactory)

    return new ProjectGraphViewModel(
      context,
      dataSource,
      layoutService,
      fullscreen,
      branchNodeFactory,
      revisionNodeFactory,
      collapsedNodeFactory,
      endpointNodeFactory,
      edgeFactory,
    )
  },
  { scope: 'request' },
)
