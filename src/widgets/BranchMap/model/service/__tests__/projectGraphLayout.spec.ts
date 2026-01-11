import { ProjectGraphBranch, ProjectGraphRevision } from '../../../lib/types'
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
  sortKeyRevisions,
} from '../projectGraphLayout'

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

describe('projectGraphLayout', () => {
  describe('buildBranchTree', () => {
    it('should build branch map by name', () => {
      const master = createBranch({ name: 'master' })
      const develop = createBranch({ name: 'develop', isRoot: false, parentBranchName: 'master' })

      const { branchByName } = buildBranchTree([master, develop])

      expect(branchByName.get('master')).toBe(master)
      expect(branchByName.get('develop')).toBe(develop)
    })

    it('should build children map', () => {
      const master = createBranch({ name: 'master' })
      const develop = createBranch({ name: 'develop', isRoot: false, parentBranchName: 'master' })
      const feature = createBranch({ name: 'feature', isRoot: false, parentBranchName: 'master' })

      const { branchChildren } = buildBranchTree([master, develop, feature])

      expect(branchChildren.get('master')).toEqual(['develop', 'feature'])
      expect(branchChildren.get('develop')).toBeUndefined()
    })

    it('should handle branch with no parent', () => {
      const master = createBranch({ name: 'master', parentBranchName: null })

      const { branchChildren } = buildBranchTree([master])

      expect(branchChildren.size).toBe(0)
    })
  })

  describe('calculateSubtreeHeights', () => {
    it('should return 1 for leaf branch', () => {
      const master = createBranch({ name: 'master' })
      const { branchChildren } = buildBranchTree([master])

      const heights = calculateSubtreeHeights([master], branchChildren)

      expect(heights.get('master')).toBe(1)
    })

    it('should calculate height for branch with one child', () => {
      const master = createBranch({ name: 'master' })
      const develop = createBranch({ name: 'develop', parentBranchName: 'master' })
      const { branchChildren } = buildBranchTree([master, develop])

      const heights = calculateSubtreeHeights([master, develop], branchChildren)

      expect(heights.get('master')).toBe(2)
      expect(heights.get('develop')).toBe(1)
    })

    it('should calculate height for branch with multiple children', () => {
      const master = createBranch({ name: 'master' })
      const develop = createBranch({ name: 'develop', parentBranchName: 'master' })
      const feature = createBranch({ name: 'feature', parentBranchName: 'master' })
      const { branchChildren } = buildBranchTree([master, develop, feature])

      const heights = calculateSubtreeHeights([master, develop, feature], branchChildren)

      expect(heights.get('master')).toBe(3)
    })

    it('should calculate height for nested branches', () => {
      const master = createBranch({ name: 'master' })
      const develop = createBranch({ name: 'develop', parentBranchName: 'master' })
      const feature = createBranch({ name: 'feature', parentBranchName: 'develop' })
      const { branchChildren } = buildBranchTree([master, develop, feature])

      const heights = calculateSubtreeHeights([master, develop, feature], branchChildren)

      expect(heights.get('master')).toBe(3)
      expect(heights.get('develop')).toBe(2)
      expect(heights.get('feature')).toBe(1)
    })
  })

  describe('collectKeyRevisions', () => {
    it('should collect start, head, draft revisions', () => {
      const branch = createBranch()

      const keyRevisions = collectKeyRevisions(branch, [branch])

      expect(keyRevisions).toHaveLength(3)
      expect(keyRevisions[0]).toEqual({ rev: branch.startRevision, type: 'start' })
      expect(keyRevisions[1]).toEqual({ rev: branch.headRevision, type: 'head' })
      expect(keyRevisions[2]).toEqual({ rev: branch.draftRevision, type: 'draft' })
    })

    it('should not duplicate if start === head', () => {
      const revision = createRevision({ id: 'same-rev', isStart: true, isHead: true })
      const draftRevision = createRevision({ id: 'draft-rev', isDraft: true, parentId: 'same-rev' })
      const branch = createBranch({
        startRevision: revision,
        headRevision: revision,
        draftRevision,
      })

      const keyRevisions = collectKeyRevisions(branch, [branch])

      expect(keyRevisions).toHaveLength(2)
      expect(keyRevisions[0].rev.id).toBe('same-rev')
      expect(keyRevisions[1].rev.id).toBe('draft-rev')
    })

    it('should not duplicate if head === draft', () => {
      const startRevision = createRevision({ id: 'start-rev', isStart: true })
      const headDraft = createRevision({ id: 'head-draft', isHead: true, isDraft: true, parentId: 'start-rev' })
      const branch = createBranch({
        startRevision,
        headRevision: headDraft,
        draftRevision: headDraft,
      })

      const keyRevisions = collectKeyRevisions(branch, [branch])

      expect(keyRevisions).toHaveLength(2)
    })

    it('should collect parent revisions for child branches', () => {
      const parentRev = createRevision({ id: 'parent-rev' })
      const master = createBranch({ id: 'master-id', name: 'master' })
      const develop = createBranch({
        name: 'develop',
        parentBranchId: 'master-id',
        parentRevision: parentRev,
      })

      const keyRevisions = collectKeyRevisions(master, [master, develop])

      const parentType = keyRevisions.find((kr) => kr.type === 'parent')
      expect(parentType).toBeDefined()
      expect(parentType?.rev.id).toBe('parent-rev')
    })

    it('should collect revisions with endpoints', () => {
      const headWithEndpoint = createRevision({
        id: 'head-rev',
        isHead: true,
        endpoints: [{ id: 'ep-1', type: 'GRAPHQL', revisionId: 'head-rev', createdAt: '2024-01-01' }],
      })
      const branch = createBranch({ headRevision: headWithEndpoint })

      const keyRevisions = collectKeyRevisions(branch, [branch])

      const hasHead = keyRevisions.some((kr) => kr.rev.id === 'head-rev')
      expect(hasHead).toBe(true)
    })
  })

  describe('sortKeyRevisions', () => {
    it('should sort by parent-child chain even when draft has endpoint (bug fix)', () => {
      // Real data from backend for develop branch:
      // - start: has REST_API endpoint
      // - head:  NO endpoints, parentId = start.id
      // - draft: has GRAPHQL endpoint, parentId = head.id
      //
      // BUG: Old sorting by type gave [start, draft(endpoint-source), head]
      // This caused collapsed node between draft and head because head.parentId !== draft.id
      //
      // FIX: Topological sort by parent-child chain gives [start, head, draft]

      const startRev = createRevision({
        id: 'start-id',
        isStart: true,
        parentId: 'master-head-id',
        endpoints: [{ id: 'ep-1', type: 'REST_API', revisionId: 'start-id', createdAt: '2024-01-01' }],
      })
      const headRev = createRevision({
        id: 'head-id',
        isHead: true,
        parentId: 'start-id',
        endpoints: [],
      })
      const draftRev = createRevision({
        id: 'draft-id',
        isDraft: true,
        parentId: 'head-id',
        endpoints: [{ id: 'ep-2', type: 'GRAPHQL', revisionId: 'draft-id', createdAt: '2024-01-02' }],
      })

      const branch = createBranch({
        id: 'develop-id',
        name: 'develop',
        isRoot: false,
        startRevision: startRev,
        headRevision: headRev,
        draftRevision: draftRev,
      })

      const keyRevisions = collectKeyRevisions(branch, [branch])
      const sorted = sortKeyRevisions(keyRevisions)

      expect(sorted[0].rev.id).toBe('start-id')
      expect(sorted[1].rev.id).toBe('head-id')
      expect(sorted[2].rev.id).toBe('draft-id')
    })
  })

  describe('isDirectConnection', () => {
    it('should return true when next revision parent is current', () => {
      const current = createRevision({ id: 'current' })
      const next = createRevision({ id: 'next', parentId: 'current' })

      expect(isDirectConnection(current, next)).toBe(true)
    })

    it('should return false when next revision parent is different', () => {
      const current = createRevision({ id: 'current' })
      const next = createRevision({ id: 'next', parentId: 'other' })

      expect(isDirectConnection(current, next)).toBe(false)
    })

    it('should return false when next revision has no parent', () => {
      const current = createRevision({ id: 'current' })
      const next = createRevision({ id: 'next', parentId: null })

      expect(isDirectConnection(current, next)).toBe(false)
    })
  })

  describe('calculateRevisionPositions', () => {
    it('should calculate positions for single revision', () => {
      const keyRevisions = [{ rev: createRevision({ id: 'rev-1' }), type: 'start' as const }]

      const { positions } = calculateRevisionPositions(keyRevisions, 100)

      expect(positions.get('rev-1')).toBe(100)
    })

    it('should calculate positions for connected revisions', () => {
      const rev1 = createRevision({ id: 'rev-1' })
      const rev2 = createRevision({ id: 'rev-2', parentId: 'rev-1' })
      const keyRevisions = [
        { rev: rev1, type: 'start' as const },
        { rev: rev2, type: 'head' as const },
      ]

      const { positions } = calculateRevisionPositions(keyRevisions, 100)

      const { NODE_WIDTH, HORIZONTAL_GAP } = LAYOUT_CONSTANTS
      expect(positions.get('rev-1')).toBe(100)
      expect(positions.get('rev-2')).toBe(100 + NODE_WIDTH + HORIZONTAL_GAP)
    })

    it('should add extra space for non-connected revisions', () => {
      const rev1 = createRevision({ id: 'rev-1' })
      const rev2 = createRevision({ id: 'rev-2', parentId: 'other' })
      const keyRevisions = [
        { rev: rev1, type: 'start' as const },
        { rev: rev2, type: 'head' as const },
      ]

      const { positions } = calculateRevisionPositions(keyRevisions, 100)

      const { NODE_WIDTH, HORIZONTAL_GAP } = LAYOUT_CONSTANTS
      const expectedGap = 2 * (NODE_WIDTH + HORIZONTAL_GAP)
      expect(positions.get('rev-2')).toBe(100 + expectedGap)
    })

    it('should NOT add collapsed node when child branch head is direct child of start', () => {
      // BUG: In child branch (develop), start revision's parent is in master branch.
      // head revision is a direct child of start, but isDirectConnection checks
      // head.parentId === start.id, which should be true for direct children.
      //
      // Scenario: develop branch created from master
      // - start (id: "dev-start", parentId: "master-rev") <- parent is in master
      // - head (id: "dev-head", parentId: "dev-start") <- direct child of start
      //
      // Expected: NO collapsed node between start and head
      // Actual: collapsed node appears because sorting doesn't preserve parent-child order

      const startRev = createRevision({ id: 'dev-start', isStart: true, parentId: 'master-rev' })
      const headRev = createRevision({ id: 'dev-head', isHead: true, parentId: 'dev-start' })

      const keyRevisions = [
        { rev: startRev, type: 'start' as const },
        { rev: headRev, type: 'head' as const },
      ]

      const { positions } = calculateRevisionPositions(keyRevisions, 100)

      const { NODE_WIDTH, HORIZONTAL_GAP } = LAYOUT_CONSTANTS
      // head should be directly after start (no collapsed node space)
      expect(positions.get('dev-start')).toBe(100)
      expect(positions.get('dev-head')).toBe(100 + NODE_WIDTH + HORIZONTAL_GAP)
    })
  })

  describe('calculateBranchY', () => {
    it('should calculate Y position for row 0', () => {
      const y = calculateBranchY(0)
      expect(y).toBe(LAYOUT_CONSTANTS.VERTICAL_GAP)
    })

    it('should calculate Y position for row 1', () => {
      const y = calculateBranchY(1)
      expect(y).toBe(LAYOUT_CONSTANTS.BRANCH_VERTICAL_GAP + LAYOUT_CONSTANTS.VERTICAL_GAP)
    })

    it('should calculate Y position for row 2', () => {
      const y = calculateBranchY(2)
      expect(y).toBe(2 * LAYOUT_CONSTANTS.BRANCH_VERTICAL_GAP + LAYOUT_CONSTANTS.VERTICAL_GAP)
    })
  })

  describe('calculateBranchNodeX', () => {
    it('should place branch node to the left of first revision', () => {
      const firstRevisionX = 300

      const branchNodeX = calculateBranchNodeX(firstRevisionX)

      const { NODE_WIDTH, HORIZONTAL_GAP } = LAYOUT_CONSTANTS
      expect(branchNodeX).toBe(firstRevisionX - NODE_WIDTH - HORIZONTAL_GAP)
    })
  })

  describe('calculateEndpointOffsets', () => {
    it('should return symmetric offsets', () => {
      const { graphqlOffsetX, restOffsetX } = calculateEndpointOffsets()

      expect(graphqlOffsetX).toBeLessThan(0)
      expect(restOffsetX).toBeGreaterThan(0)
      expect(Math.abs(graphqlOffsetX)).toBe(Math.abs(restOffsetX))
    })
  })

  describe('calculateGraphWidth', () => {
    it('should calculate width based on max node X', () => {
      const maxNodeX = 500

      const width = calculateGraphWidth(maxNodeX)

      const { NODE_WIDTH, HORIZONTAL_GAP } = LAYOUT_CONSTANTS
      expect(width).toBe(maxNodeX + NODE_WIDTH + HORIZONTAL_GAP * 2)
    })

    it('should work with zero maxNodeX', () => {
      const width = calculateGraphWidth(0)

      const { NODE_WIDTH, HORIZONTAL_GAP } = LAYOUT_CONSTANTS
      expect(width).toBe(NODE_WIDTH + HORIZONTAL_GAP * 2)
    })
  })

  describe('calculateGraphHeight', () => {
    it('should calculate height based on min and max Y', () => {
      const minY = 100
      const maxY = 400

      const height = calculateGraphHeight(minY, maxY)

      const { NODE_HEIGHT, VERTICAL_GAP } = LAYOUT_CONSTANTS
      expect(height).toBe(maxY - minY + NODE_HEIGHT + VERTICAL_GAP * 2)
    })

    it('should work with same min and max Y', () => {
      const sameY = 200

      const height = calculateGraphHeight(sameY, sameY)

      const { NODE_HEIGHT, VERTICAL_GAP } = LAYOUT_CONSTANTS
      expect(height).toBe(NODE_HEIGHT + VERTICAL_GAP * 2)
    })
  })
})
