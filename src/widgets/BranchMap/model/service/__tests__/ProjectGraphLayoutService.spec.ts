import { ProjectGraphLayoutService } from '../ProjectGraphLayoutService'
import {
  EndpointData,
  EndpointNodeData,
  ProjectBranchNodeData,
  ProjectGraphBranch,
  ProjectGraphData,
  ProjectGraphRevision,
  RevisionNodeData,
} from '../../../lib/types'

const createEndpoint = (overrides: Partial<EndpointData> = {}): EndpointData => ({
  id: 'endpoint-1',
  type: 'GRAPHQL',
  revisionId: 'rev-1',
  createdAt: '2024-01-01',
  ...overrides,
})

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

const createProjectGraphData = (branches: ProjectGraphBranch[]): ProjectGraphData => ({
  projectName: 'test-project',
  branches,
})

describe('ProjectGraphLayoutService', () => {
  let service: ProjectGraphLayoutService

  beforeEach(() => {
    service = new ProjectGraphLayoutService()
  })

  describe('calculateLayout', () => {
    it('should return empty layout for empty branches', () => {
      const data = createProjectGraphData([])

      const layout = service.calculateLayout(data)

      expect(layout.nodes).toHaveLength(0)
      expect(layout.edges).toHaveLength(0)
      expect(layout.width).toBe(0)
      expect(layout.height).toBe(0)
    })

    describe('single branch', () => {
      it('should create branch node', () => {
        const branch = createBranch()
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const branchNode = layout.nodes.find((n) => n.type === 'branch')
        expect(branchNode).toBeDefined()
        expect(branchNode?.id).toBe('branch-branch-1')
      })

      it('should create revision nodes for start, head, draft', () => {
        const branch = createBranch()
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const revisionNodes = layout.nodes.filter((n) => n.type === 'revision')
        expect(revisionNodes).toHaveLength(3)

        const ids = revisionNodes.map((n) => n.id)
        expect(ids).toContain('start-rev')
        expect(ids).toContain('head-rev')
        expect(ids).toContain('draft-rev')
      })

      it('should create edge from branch to first revision', () => {
        const branch = createBranch()
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const branchEdge = layout.edges.find((e) => e.type === 'branch')
        expect(branchEdge).toBeDefined()
        expect(branchEdge?.sourceId).toBe('branch-branch-1')
        expect(branchEdge?.targetId).toBe('start-rev')
      })

      it('should create revision edges between connected revisions', () => {
        const branch = createBranch()
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const revisionEdges = layout.edges.filter((e) => e.type === 'revision')
        expect(revisionEdges.length).toBeGreaterThan(0)
      })
    })

    describe('multiple branches', () => {
      it('should create nodes for child branch', () => {
        const parentRev = createRevision({ id: 'parent-rev', parentId: 'start-rev' })
        const master = createBranch({
          id: 'master-id',
          name: 'master',
          headRevision: parentRev,
        })
        const develop = createBranch({
          id: 'develop-id',
          name: 'develop',
          isRoot: false,
          parentBranchId: 'master-id',
          parentBranchName: 'master',
          parentRevision: parentRev,
        })
        const data = createProjectGraphData([master, develop])

        const layout = service.calculateLayout(data)

        const branchNodes = layout.nodes.filter((n) => n.type === 'branch')
        expect(branchNodes).toHaveLength(2)
      })

      it('should create parent-to-branch edge for child branch', () => {
        const parentRev = createRevision({ id: 'parent-rev', parentId: 'start-rev' })
        const master = createBranch({
          id: 'master-id',
          name: 'master',
          headRevision: parentRev,
        })
        const develop = createBranch({
          id: 'develop-id',
          name: 'develop',
          isRoot: false,
          parentBranchId: 'master-id',
          parentBranchName: 'master',
          parentRevision: parentRev,
        })
        const data = createProjectGraphData([master, develop])

        const layout = service.calculateLayout(data)

        const parentToBranchEdge = layout.edges.find((e) => e.type === 'parent-to-branch')
        expect(parentToBranchEdge).toBeDefined()
        expect(parentToBranchEdge?.sourceId).toBe('parent-rev')
        expect(parentToBranchEdge?.targetId).toBe('branch-develop-id')
      })

      it('should position child branch below parent', () => {
        const parentRev = createRevision({ id: 'parent-rev', parentId: 'start-rev' })
        const master = createBranch({
          id: 'master-id',
          name: 'master',
          headRevision: parentRev,
        })
        const develop = createBranch({
          id: 'develop-id',
          name: 'develop',
          isRoot: false,
          parentBranchId: 'master-id',
          parentBranchName: 'master',
          parentRevision: parentRev,
        })
        const data = createProjectGraphData([master, develop])

        const layout = service.calculateLayout(data)

        const masterBranch = layout.nodes.find((n) => n.id === 'branch-master-id')
        const developBranch = layout.nodes.find((n) => n.id === 'branch-develop-id')

        expect(masterBranch).toBeDefined()
        expect(developBranch).toBeDefined()
        expect(developBranch!.y).toBeGreaterThan(masterBranch!.y)
      })
    })

    describe('collapsed nodes', () => {
      it('should create collapsed node between non-connected revisions', () => {
        const startRev = createRevision({ id: 'start-rev', isStart: true })
        const headRev = createRevision({ id: 'head-rev', isHead: true, parentId: 'other-rev' })
        const draftRev = createRevision({ id: 'draft-rev', isDraft: true, parentId: 'head-rev' })
        const branch = createBranch({
          startRevision: startRev,
          headRevision: headRev,
          draftRevision: draftRev,
        })
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const collapsedNodes = layout.nodes.filter((n) => n.type === 'collapsed')
        expect(collapsedNodes.length).toBeGreaterThan(0)
      })

      it('should not create collapsed node between connected revisions', () => {
        const startRev = createRevision({ id: 'start-rev', isStart: true })
        const headRev = createRevision({ id: 'head-rev', isHead: true, parentId: 'start-rev' })
        const draftRev = createRevision({ id: 'draft-rev', isDraft: true, parentId: 'head-rev' })
        const branch = createBranch({
          startRevision: startRev,
          headRevision: headRev,
          draftRevision: draftRev,
        })
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const collapsedNodes = layout.nodes.filter((n) => n.type === 'collapsed')
        expect(collapsedNodes).toHaveLength(0)
      })

      it('should not create collapsed node in child branch when head is direct child of start', () => {
        // Scenario: develop branch forked from master with one commit
        // - develop has: start(fork-point) -> head -> draft
        // - head.parentId === start.id

        // Master branch
        const masterStart = createRevision({ id: 'master-start', isStart: true, parentId: null })
        const masterRev2 = createRevision({ id: 'master-rev2', parentId: 'master-start' })
        const masterHead = createRevision({ id: 'master-head', isHead: true, parentId: 'master-rev2' })
        const masterDraft = createRevision({ id: 'master-draft', isDraft: true, parentId: 'master-head' })

        const master = createBranch({
          id: 'master-id',
          name: 'master',
          isRoot: true,
          startRevision: masterStart,
          headRevision: masterHead,
          draftRevision: masterDraft,
        })

        // Develop branch - forked from master at rev2
        const devStart = createRevision({
          id: 'master-rev2', // Same as fork point
          isStart: true,
          parentId: 'master-start',
        })
        const devHead = createRevision({
          id: 'dev-head',
          isHead: true,
          parentId: 'master-rev2', // Direct child of start
        })
        const devDraft = createRevision({
          id: 'dev-draft',
          isDraft: true,
          parentId: 'dev-head',
        })

        const develop = createBranch({
          id: 'develop-id',
          name: 'develop',
          isRoot: false,
          parentBranchId: 'master-id',
          parentBranchName: 'master',
          parentRevision: masterRev2,
          startRevision: devStart,
          headRevision: devHead,
          draftRevision: devDraft,
        })

        const data = createProjectGraphData([master, develop])
        const layout = service.calculateLayout(data)

        // Find collapsed nodes in develop branch
        const developCollapsedNodes = layout.nodes.filter((n) => n.type === 'collapsed' && n.id.includes('develop'))

        expect(developCollapsedNodes).toHaveLength(0)
      })
    })

    describe('endpoints', () => {
      it('should create endpoint node for revision with GraphQL endpoint', () => {
        const endpoint = createEndpoint({ type: 'GRAPHQL' })
        const startRev = createRevision({ id: 'start-rev', isStart: true, endpoints: [endpoint] })
        const branch = createBranch({ startRevision: startRev })
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const endpointNodes = layout.nodes.filter((n) => n.type === 'endpoint')
        expect(endpointNodes.length).toBeGreaterThan(0)
      })

      it('should create endpoint node for revision with REST endpoint', () => {
        const endpoint = createEndpoint({ type: 'REST_API' })
        const startRev = createRevision({ id: 'start-rev', isStart: true, endpoints: [endpoint] })
        const branch = createBranch({ startRevision: startRev })
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const endpointNodes = layout.nodes.filter((n) => n.type === 'endpoint')
        expect(endpointNodes.length).toBeGreaterThan(0)
      })

      it('should create separate endpoint nodes for GraphQL and REST', () => {
        const graphqlEndpoint = createEndpoint({ id: 'gql-1', type: 'GRAPHQL' })
        const restEndpoint = createEndpoint({ id: 'rest-1', type: 'REST_API' })
        const startRev = createRevision({
          id: 'start-rev',
          isStart: true,
          endpoints: [graphqlEndpoint, restEndpoint],
        })
        const branch = createBranch({ startRevision: startRev })
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const endpointNodes = layout.nodes.filter((n) => n.type === 'endpoint')
        expect(endpointNodes).toHaveLength(2)
      })

      it('should create endpoint edges', () => {
        const endpoint = createEndpoint({ type: 'GRAPHQL' })
        const startRev = createRevision({ id: 'start-rev', isStart: true, endpoints: [endpoint] })
        const branch = createBranch({ startRevision: startRev })
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const endpointEdges = layout.edges.filter((e) => e.type === 'endpoint-graphql' || e.type === 'endpoint-rest')
        expect(endpointEdges.length).toBeGreaterThan(0)
      })

      it('should position endpoint nodes above revision', () => {
        const endpoint = createEndpoint({ type: 'GRAPHQL' })
        const startRev = createRevision({ id: 'start-rev', isStart: true, endpoints: [endpoint] })
        const branch = createBranch({ startRevision: startRev })
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const revisionNode = layout.nodes.find((n) => n.id === 'start-rev')
        const endpointNode = layout.nodes.find((n) => n.type === 'endpoint')

        expect(revisionNode).toBeDefined()
        expect(endpointNode).toBeDefined()
        expect(endpointNode!.y).toBeLessThan(revisionNode!.y)
      })
    })

    describe('layout dimensions', () => {
      it('should calculate width based on rightmost node', () => {
        const branch = createBranch()
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        expect(layout.width).toBeGreaterThan(0)
      })

      it('should calculate height based on top and bottom nodes', () => {
        const branch = createBranch()
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        expect(layout.height).toBeGreaterThan(0)
      })

      it('should increase height with more branches', () => {
        const parentRev = createRevision({ id: 'parent-rev', parentId: 'start-rev' })
        const master = createBranch({
          id: 'master-id',
          name: 'master',
          headRevision: parentRev,
        })
        const develop = createBranch({
          id: 'develop-id',
          name: 'develop',
          isRoot: false,
          parentBranchId: 'master-id',
          parentBranchName: 'master',
          parentRevision: parentRev,
        })

        const singleBranchLayout = service.calculateLayout(createProjectGraphData([master]))
        const twoBranchLayout = service.calculateLayout(createProjectGraphData([master, develop]))

        expect(twoBranchLayout.height).toBeGreaterThan(singleBranchLayout.height)
      })
    })

    describe('node data', () => {
      it('should include revision data in revision node', () => {
        const branch = createBranch()
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const revisionNode = layout.nodes.find((n) => n.id === 'start-rev')
        expect(revisionNode).toBeDefined()
        const revisionData = revisionNode!.data as RevisionNodeData
        expect(revisionData.revision.id).toBe('start-rev')
        expect(revisionData.revision.isStart).toBe(true)
      })

      it('should include branch data in branch node', () => {
        const branch = createBranch()
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const branchNode = layout.nodes.find((n) => n.type === 'branch')
        expect(branchNode).toBeDefined()
        const branchData = branchNode!.data as ProjectBranchNodeData
        expect(branchData.branch.name).toBe('master')
      })

      it('should include endpoints data in endpoint node', () => {
        const endpoint = createEndpoint({ type: 'GRAPHQL' })
        const startRev = createRevision({ id: 'start-rev', isStart: true, endpoints: [endpoint] })
        const branch = createBranch({ startRevision: startRev })
        const data = createProjectGraphData([branch])

        const layout = service.calculateLayout(data)

        const endpointNode = layout.nodes.find((n) => n.type === 'endpoint')
        expect(endpointNode).toBeDefined()
        const endpointData = endpointNode!.data as EndpointNodeData
        expect(endpointData.endpoints).toHaveLength(1)
        expect(endpointData.revisionId).toBe('start-rev')
      })
    })
  })
})
