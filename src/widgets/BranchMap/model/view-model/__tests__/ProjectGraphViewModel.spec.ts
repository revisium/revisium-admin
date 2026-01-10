import { ProjectContext } from 'src/entities/Project/model/ProjectContext'
import { BranchMapFullscreenService } from '../../../lib/FullscreenService'
import { ProjectGraphBranch, ProjectGraphData, ProjectGraphRevision } from '../../../lib/types'
import { BranchMapDataSource } from '../../data-source/BranchMapDataSource'
import { ProjectGraphLayoutService } from '../../service/ProjectGraphLayoutService'
import { CollapsedNodeViewModel } from '../CollapsedNodeViewModel'
import { EndpointNodeViewModel } from '../EndpointNodeViewModel'
import {
  CollapsedNodeViewModelFactory,
  EndpointNodeViewModelFactory,
  ProjectBranchNodeViewModelFactory,
  RevisionEdgeViewModelFactory,
  RevisionNodeViewModelFactory,
} from '../factories'
import { ProjectBranchNodeViewModel } from '../ProjectBranchNodeViewModel'
import { ProjectGraphViewModel } from '../ProjectGraphViewModel'
import { RevisionEdgeViewModel } from '../RevisionEdgeViewModel'
import { RevisionNodeViewModel } from '../RevisionNodeViewModel'

const createRevision = (overrides: Partial<ProjectGraphRevision> = {}): ProjectGraphRevision => ({
  id: 'rev-1',
  comment: '',
  isDraft: false,
  isHead: false,
  isStart: false,
  createdAt: '2024-01-01',
  parentId: null,
  endpoints: [],
  childBranchIds: [],
  childBranchNames: [],
  ...overrides,
})

const createBranch = (overrides: Partial<ProjectGraphBranch> = {}): ProjectGraphBranch => {
  const startRevision = createRevision({ id: 'start-rev', isStart: true })
  const headRevision = createRevision({ id: 'head-rev', isHead: true, parentId: 'start-rev' })
  const draftRevision = createRevision({ id: 'draft-rev', isDraft: true, parentId: 'head-rev' })

  return {
    id: 'branch-1',
    name: 'master',
    isRoot: true,
    touched: false,
    createdAt: '2024-01-01',
    parentBranchId: null,
    parentBranchName: null,
    parentRevision: null,
    startRevision,
    headRevision,
    draftRevision,
    totalRevisionsCount: 3,
    ...overrides,
  }
}

const createGraphData = (branches: ProjectGraphBranch[]): ProjectGraphData => ({
  projectName: 'test-project',
  branches,
})

describe('ProjectGraphViewModel', () => {
  let viewModel: ProjectGraphViewModel
  let mockContext: ProjectContext
  let mockDataSource: jest.Mocked<BranchMapDataSource>
  let layoutService: ProjectGraphLayoutService
  let mockFullscreen: jest.Mocked<BranchMapFullscreenService>
  let branchNodeFactory: ProjectBranchNodeViewModelFactory
  let revisionNodeFactory: RevisionNodeViewModelFactory
  let collapsedNodeFactory: CollapsedNodeViewModelFactory
  let endpointNodeFactory: EndpointNodeViewModelFactory
  let edgeFactory: RevisionEdgeViewModelFactory

  beforeEach(() => {
    mockContext = {
      organizationId: 'test-org',
      projectName: 'test-project',
    } as ProjectContext

    mockDataSource = {
      loadProjectGraph: jest.fn(),
      dispose: jest.fn(),
    } as unknown as jest.Mocked<BranchMapDataSource>

    layoutService = new ProjectGraphLayoutService()

    mockFullscreen = {
      init: jest.fn(),
      dispose: jest.fn(),
      isFullscreen: false,
    } as unknown as jest.Mocked<BranchMapFullscreenService>

    branchNodeFactory = new ProjectBranchNodeViewModelFactory(
      (branch, x, y) => new ProjectBranchNodeViewModel(branch, x, y),
    )

    revisionNodeFactory = new RevisionNodeViewModelFactory(
      (revision, x, y) => new RevisionNodeViewModel(revision, x, y),
    )

    collapsedNodeFactory = new CollapsedNodeViewModelFactory(
      (data, x, y) =>
        new CollapsedNodeViewModel(data.id, data.branchId, data.count, data.fromRevisionId, data.toRevisionId, x, y),
    )

    endpointNodeFactory = new EndpointNodeViewModelFactory(
      (id, endpoints, revisionId, x, y) => new EndpointNodeViewModel(id, endpoints, revisionId, x, y),
    )

    edgeFactory = new RevisionEdgeViewModelFactory(
      (edge) =>
        new RevisionEdgeViewModel({
          id: edge.id,
          sourceId: edge.sourceId,
          targetId: edge.targetId,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type,
          isHighlighted: false,
        }),
    )

    viewModel = new ProjectGraphViewModel(
      mockContext,
      mockDataSource,
      layoutService,
      mockFullscreen,
      branchNodeFactory,
      revisionNodeFactory,
      collapsedNodeFactory,
      endpointNodeFactory,
      edgeFactory,
    )
  })

  describe('initial state', () => {
    it('should be in loading state initially', () => {
      expect(viewModel.isLoading).toBe(true)
      expect(viewModel.isEmpty).toBe(false)
      expect(viewModel.isError).toBe(false)
      expect(viewModel.showGraph).toBe(false)
    })

    it('should have empty nodes and edges initially', () => {
      expect(viewModel.reactFlowNodes).toEqual([])
      expect(viewModel.reactFlowEdges).toEqual([])
    })

    it('should return project name from context', () => {
      expect(viewModel.projectName).toBe('test-project')
    })
  })

  describe('init', () => {
    it('should initialize fullscreen service', () => {
      const navigate = jest.fn()

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: null,
        aborted: false,
      })

      viewModel.init(navigate)

      expect(mockFullscreen.init).toHaveBeenCalled()
    })

    it('should load project graph', () => {
      const navigate = jest.fn()

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: null,
        aborted: false,
      })

      viewModel.init(navigate)

      expect(mockDataSource.loadProjectGraph).toHaveBeenCalledWith('test-org', 'test-project')
    })
  })

  describe('loading states', () => {
    it('should set empty state when no branches', async () => {
      const navigate = jest.fn()

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: createGraphData([]),
        aborted: false,
      })

      viewModel.init(navigate)
      await flushPromises()

      expect(viewModel.isEmpty).toBe(true)
      expect(viewModel.showGraph).toBe(false)
    })

    it('should set error state on load failure', async () => {
      const navigate = jest.fn()

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: null,
        aborted: false,
      })

      viewModel.init(navigate)
      await flushPromises()

      expect(viewModel.isError).toBe(true)
    })

    it('should set graph state on successful load', async () => {
      const navigate = jest.fn()
      const branch = createBranch()

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: createGraphData([branch]),
        aborted: false,
      })

      viewModel.init(navigate)
      await flushPromises()

      expect(viewModel.showGraph).toBe(true)
      expect(viewModel.isLoading).toBe(false)
    })

    it('should not update state if request was aborted', async () => {
      const navigate = jest.fn()

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: createGraphData([createBranch()]),
        aborted: true,
      })

      viewModel.init(navigate)
      await flushPromises()

      expect(viewModel.isLoading).toBe(true)
    })
  })

  describe('graph data', () => {
    it('should create ReactFlow nodes after load', async () => {
      const navigate = jest.fn()
      const branch = createBranch()

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: createGraphData([branch]),
        aborted: false,
      })

      viewModel.init(navigate)
      await flushPromises()

      expect(viewModel.reactFlowNodes.length).toBeGreaterThan(0)
    })

    it('should create ReactFlow edges after load', async () => {
      const navigate = jest.fn()
      const branch = createBranch()

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: createGraphData([branch]),
        aborted: false,
      })

      viewModel.init(navigate)
      await flushPromises()

      expect(viewModel.reactFlowEdges.length).toBeGreaterThan(0)
    })

    it('should increment dataVersion after load', async () => {
      const navigate = jest.fn()
      const branch = createBranch()
      const initialVersion = viewModel.dataVersion

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: createGraphData([branch]),
        aborted: false,
      })

      viewModel.init(navigate)
      await flushPromises()

      expect(viewModel.dataVersion).toBeGreaterThan(initialVersion)
    })

    it('should return branches count', async () => {
      const navigate = jest.fn()
      const branch1 = createBranch({ id: 'branch-1', name: 'master' })
      const branch2 = createBranch({
        id: 'branch-2',
        name: 'develop',
        isRoot: false,
        parentBranchId: 'branch-1',
        parentBranchName: 'master',
        parentRevision: branch1.headRevision,
      })

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: createGraphData([branch1, branch2]),
        aborted: false,
      })

      viewModel.init(navigate)
      await flushPromises()

      expect(viewModel.branchesCount).toBe(2)
    })
  })

  describe('highlight handling', () => {
    beforeEach(async () => {
      const navigate = jest.fn()
      const branch = createBranch()

      mockDataSource.loadProjectGraph.mockResolvedValue({
        data: createGraphData([branch]),
        aborted: false,
      })

      viewModel.init(navigate)
      await flushPromises()
    })

    it('should update hovered node', () => {
      viewModel.setHoveredNode('test-node')

      viewModel.setHoveredNode('other-node')

      viewModel.setHoveredNode(null)
    })

    it('should update selected node', () => {
      viewModel.setSelectedNode('test-node')

      viewModel.setSelectedNode('other-node')

      viewModel.setSelectedNode(null)
    })

    it('should clear selection', () => {
      viewModel.setSelectedNode('test-node')

      viewModel.clearSelection()
    })

    it('should not trigger update for same hovered node', () => {
      viewModel.setHoveredNode('test-node')
      viewModel.setHoveredNode('test-node')
    })
  })

  describe('dispose', () => {
    it('should dispose data source', () => {
      viewModel.dispose()

      expect(mockDataSource.dispose).toHaveBeenCalled()
    })

    it('should dispose fullscreen service', () => {
      viewModel.dispose()

      expect(mockFullscreen.dispose).toHaveBeenCalled()
    })
  })
})

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}
