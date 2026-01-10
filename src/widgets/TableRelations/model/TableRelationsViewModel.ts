import { Edge, Node } from '@xyflow/react'
import { IReactionDisposer, makeAutoObservable, reaction, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { FullscreenService } from '../lib/FullscreenService.ts'
import { TableRelationsLayoutService } from '../lib/TableRelationsLayoutService.ts'
import { RelationEdgeViewModel } from './RelationEdgeViewModel.ts'
import { RelationEdgeViewModelFactory } from './RelationEdgeViewModelFactory.ts'
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
  private _nodeViewModels: TableNodeViewModel[] = []
  private _edgeViewModels: RelationEdgeViewModel[] = []
  private _hoveredNodeId: string | null = null
  private _selectedNodeId: string | null = null
  private _revisionReaction: IReactionDisposer | null = null
  private _initialNodes: Node[] = []
  private _initialEdges: Edge[] = []
  private _dataVersion = 0

  constructor(
    private readonly context: ProjectContext,
    private readonly dataSource: TableRelationsDataSource,
    private readonly nodeFactory: TableNodeViewModelFactory,
    private readonly edgeFactory: RelationEdgeViewModelFactory,
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

  public get branchName(): string {
    return this.context.branchName
  }

  public get totalTablesCount(): number {
    return this._nodeViewModels.length
  }

  public get totalRelationsCount(): number {
    return this._edgeViewModels.length
  }

  public get initialNodes(): Node[] {
    return this._initialNodes
  }

  public get initialEdges(): Edge[] {
    return this._initialEdges
  }

  public get dataVersion(): number {
    return this._dataVersion
  }

  private get hasHighlight(): boolean {
    return this._hoveredNodeId !== null || this._selectedNodeId !== null
  }

  private isNodeHighlighted(nodeId: string): boolean {
    const targetId = this._hoveredNodeId ?? this._selectedNodeId
    if (!targetId) {
      return false
    }
    if (nodeId === targetId) {
      return true
    }
    for (const edge of this._edgeViewModels) {
      if (edge.sourceTableId === targetId && edge.targetTableId === nodeId) {
        return true
      }
      if (edge.targetTableId === targetId && edge.sourceTableId === nodeId) {
        return true
      }
    }
    return false
  }

  private isEdgeHighlighted(edge: RelationEdgeViewModel): boolean {
    const targetId = this._hoveredNodeId ?? this._selectedNodeId
    if (!targetId) {
      return false
    }
    return edge.sourceTableId === targetId || edge.targetTableId === targetId
  }

  private buildInitialData(): void {
    this._initialNodes = this._nodeViewModels.map((node) => ({
      id: node.id,
      type: 'tableNode',
      position: { x: node.x, y: node.y },
      data: {
        model: node,
        onMouseEnter: this.setHoveredNode,
        onMouseLeave: () => this.setHoveredNode(null),
        onClick: this.setSelectedNode,
      },
    }))

    this._initialEdges = this._edgeViewModels.map((edge) => ({
      id: edge.id,
      type: 'relationEdge',
      source: edge.sourceTableId,
      target: edge.targetTableId,
      data: {
        model: edge,
      },
    }))

    this._dataVersion++
  }

  private updateHighlightState(): void {
    const hasHighlight = this.hasHighlight

    for (const node of this._nodeViewModels) {
      const isHighlighted = this.isNodeHighlighted(node.id)
      node.setHighlighted(isHighlighted)
      node.setDimmed(hasHighlight && !isHighlighted)
    }

    for (const edge of this._edgeViewModels) {
      edge.setHighlighted(this.isEdgeHighlighted(edge))
    }
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
    this.fullscreen.init()
  }

  public dispose(): void {
    this._revisionReaction?.()
    this._revisionReaction = null
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
      if (this._selectedNodeId) {
        const prevNode = this._nodeViewModels.find((n) => n.id === this._selectedNodeId)
        prevNode?.setSelected(false)
      }

      this._selectedNodeId = nodeId

      if (nodeId) {
        const node = this._nodeViewModels.find((n) => n.id === nodeId)
        node?.setSelected(true)
      }

      this.updateHighlightState()
    }
  }

  public clearSelection(): void {
    this.setSelectedNode(null)
  }

  private reset(): void {
    this._state = State.loading
    this._nodeViewModels = []
    this._edgeViewModels = []
    this._initialNodes = []
    this._initialEdges = []
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

      this._nodeViewModels = layoutData.nodes.map((node) => this.nodeFactory.create(node))
      this._edgeViewModels = layoutData.edges.map((edge) => this.edgeFactory.create(edge))

      this.buildInitialData()
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
    const edgeFactory = container.get(RelationEdgeViewModelFactory)
    const layoutService = container.get(TableRelationsLayoutService)
    const fullscreen = container.get(FullscreenService)
    return new TableRelationsViewModel(context, dataSource, nodeFactory, edgeFactory, layoutService, fullscreen)
  },
  { scope: 'request' },
)
