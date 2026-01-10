import { Edge, Node, ReactFlowInstance } from '@xyflow/react'
import { IReactionDisposer, makeAutoObservable, reaction, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { FullscreenService } from '../lib/FullscreenService.ts'
import { LayoutData, RelationEdge } from '../lib/types.ts'
import { TableRelationsLayoutService } from '../lib/TableRelationsLayoutService.ts'
import { TableNodeViewModel } from './TableNodeViewModel.ts'
import { TableNodeViewModelFactory } from './TableNodeViewModelFactory.ts'
import { TableRelationsDataSource } from './TableRelationsDataSource.ts'

enum State {
  loading = 'loading',
  empty = 'empty',
  graph = 'graph',
  error = 'error',
}

export class TableRelationsViewModel implements IViewModel {
  private _state = State.loading
  private _layoutData: LayoutData | null = null
  private _nodeViewModels: TableNodeViewModel[] = []
  private _hoveredNodeId: string | null = null
  private _selectedNodeId: string | null = null
  private _revisionReaction: IReactionDisposer | null = null
  private _syncReaction: IReactionDisposer | null = null
  private _reactFlowInstance: ReactFlowInstance | null = null

  constructor(
    private readonly context: ProjectContext,
    private readonly dataSource: TableRelationsDataSource,
    private readonly nodeFactory: TableNodeViewModelFactory,
    private readonly layoutService: TableRelationsLayoutService,
    public readonly fullscreen: FullscreenService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get showLoading(): boolean {
    return this._state === State.loading
  }

  public get showError(): boolean {
    return this._state === State.error
  }

  public get showEmpty(): boolean {
    return this._state === State.empty
  }

  public get showGraph(): boolean {
    return this._state === State.graph
  }

  public get nodes(): TableNodeViewModel[] {
    return this._nodeViewModels
  }

  public get edges(): RelationEdge[] {
    return this._layoutData?.edges ?? []
  }

  public get graphWidth(): number {
    return this._layoutData?.width ?? 0
  }

  public get graphHeight(): number {
    return this._layoutData?.height ?? 0
  }

  public get hoveredNodeId(): string | null {
    return this._hoveredNodeId
  }

  public get selectedNodeId(): string | null {
    return this._selectedNodeId
  }

  public get branchName(): string {
    return this.context.branchName
  }

  public get totalTablesCount(): number {
    return this._nodeViewModels.length
  }

  public get totalRelationsCount(): number {
    return this._layoutData?.edges.length ?? 0
  }

  public get highlightedEdgeIds(): Set<string> {
    const result = new Set<string>()
    const targetId = this._hoveredNodeId ?? this._selectedNodeId

    if (!targetId) {
      return result
    }

    for (const edge of this.edges) {
      if (edge.sourceTableId === targetId || edge.targetTableId === targetId) {
        result.add(edge.id)
      }
    }

    return result
  }

  public get connectedNodeIds(): Set<string> {
    const result = new Set<string>()
    const targetId = this._hoveredNodeId ?? this._selectedNodeId

    if (!targetId) {
      return result
    }

    result.add(targetId)

    for (const edge of this.edges) {
      if (edge.sourceTableId === targetId) {
        result.add(edge.targetTableId)
      }
      if (edge.targetTableId === targetId) {
        result.add(edge.sourceTableId)
      }
    }

    return result
  }

  private get hasHighlight(): boolean {
    return this._hoveredNodeId !== null || this._selectedNodeId !== null
  }

  public get reactFlowNodes(): Node[] {
    return this._nodeViewModels.map((node) => ({
      id: node.id,
      type: 'tableNode',
      position: { x: node.x, y: node.y },
      data: {
        model: node,
        isHighlighted: this.connectedNodeIds.has(node.id),
        isDimmed: this.hasHighlight && !this.connectedNodeIds.has(node.id),
        onMouseEnter: this.setHoveredNode,
        onMouseLeave: () => this.setHoveredNode(null),
        onClick: this.setSelectedNode,
      },
    }))
  }

  public get reactFlowEdges(): Edge[] {
    return this.edges.map((edge) => ({
      id: edge.id,
      type: 'relationEdge',
      source: edge.sourceTableId,
      target: edge.targetTableId,
      data: {
        fieldPath: edge.fieldPath,
        isHighlighted: this.highlightedEdgeIds.has(edge.id),
        curveOffset: edge.curveOffset,
      },
    }))
  }

  public setReactFlowInstance(instance: ReactFlowInstance | null): void {
    this._reactFlowInstance = instance
    if (instance) {
      this.syncReactFlowState()
    }
  }

  private syncReactFlowState(): void {
    this._reactFlowInstance?.setNodes(this.reactFlowNodes)
    this._reactFlowInstance?.setEdges(this.reactFlowEdges)
  }

  public init(): void {
    void this.load()
    this._revisionReaction = reaction(
      () => this.context.revisionId,
      () => {
        this.reset()
        void this.load()
      },
    )
    this._syncReaction = reaction(
      () => [this.reactFlowNodes, this.reactFlowEdges],
      () => this.syncReactFlowState(),
    )
    this.fullscreen.init()
  }

  public dispose(): void {
    this._revisionReaction?.()
    this._revisionReaction = null
    this._syncReaction?.()
    this._syncReaction = null
    this._reactFlowInstance = null
    this.dataSource.dispose()
    this.fullscreen.dispose()
  }

  public setHoveredNode(nodeId: string | null): void {
    if (this._hoveredNodeId !== nodeId) {
      if (this._hoveredNodeId) {
        const prevNode = this._nodeViewModels.find((n) => n.id === this._hoveredNodeId)
        prevNode?.setHovered(false)
      }

      this._hoveredNodeId = nodeId

      if (nodeId) {
        const node = this._nodeViewModels.find((n) => n.id === nodeId)
        node?.setHovered(true)
      }
    }
  }

  public setSelectedNode(nodeId: string | null): void {
    if (this._selectedNodeId !== nodeId) {
      if (this._selectedNodeId) {
        const prevNode = this._nodeViewModels.find((n) => n.id === this._selectedNodeId)
        prevNode?.setSelected(false)
      }

      this._selectedNodeId = nodeId

      if (nodeId) {
        const node = this._nodeViewModels.find((n) => n.id === nodeId)
        node?.setSelected(true)
      }
    }
  }

  public clearSelection(): void {
    this.setSelectedNode(null)
  }

  private reset(): void {
    this._state = State.loading
    this._layoutData = null
    this._nodeViewModels = []
    this._hoveredNodeId = null
    this._selectedNodeId = null
  }

  private async load(): Promise<void> {
    const { tables, aborted } = await this.dataSource.load(this.context.revisionId)

    if (aborted) {
      return
    }

    if (tables === null) {
      runInAction(() => {
        this._state = State.error
      })
      return
    }

    runInAction(() => {
      if (tables.length === 0) {
        this._state = State.empty
        return
      }

      const graphData = this.layoutService.buildGraph(tables)
      const layoutData = this.layoutService.calculateLayout(graphData)

      this._layoutData = layoutData
      this._nodeViewModels = layoutData.nodes.map((node) => this.nodeFactory.create(node))
      this._state = State.graph
    })
  }
}

container.register(
  TableRelationsViewModel,
  () => {
    const context = container.get(ProjectContext)
    const dataSource = container.get(TableRelationsDataSource)
    const nodeFactory = container.get(TableNodeViewModelFactory)
    const layoutService = container.get(TableRelationsLayoutService)
    const fullscreen = container.get(FullscreenService)
    return new TableRelationsViewModel(context, dataSource, nodeFactory, layoutService, fullscreen)
  },
  { scope: 'request' },
)
