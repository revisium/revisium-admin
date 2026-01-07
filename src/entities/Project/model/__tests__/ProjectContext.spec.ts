jest.mock('src/shared/model/RouterService.ts', () => ({
  RouterService: jest.fn(),
}))

import { makeAutoObservable, runInAction } from 'mobx'
import { ApiService } from 'src/shared/model/ApiService'
import { PermissionContext } from 'src/shared/model/AbilityService'

type RouterService = { params: MockRouterParams }

const createMockProject = (overrides: Partial<ReturnType<typeof createMockProject>> = {}) => ({
  id: 'project-1',
  name: 'test-project',
  isPublic: false,
  organization: { id: 'org-1', name: 'test-org' },
  rootBranch: {
    id: 'branch-1',
    name: 'master',
    touched: false,
    draft: { id: 'draft-1', comment: null },
    head: { id: 'head-1', comment: 'Initial commit' },
  },
  ...overrides,
})

const createMockBranch = (overrides: Partial<ReturnType<typeof createMockBranch>> = {}) => ({
  id: 'branch-2',
  name: 'feature',
  touched: false,
  draft: { id: 'draft-2', comment: null },
  head: { id: 'head-2', comment: 'Feature commit' },
  ...overrides,
})

const createMockRevision = (overrides: Partial<ReturnType<typeof createMockRevision>> = {}) => ({
  id: 'revision-1',
  comment: 'Test revision',
  ...overrides,
})

const createMockTable = () => ({
  id: 'table-1',
  versionId: 'v1',
  schema: { type: 'object', properties: {} },
})

const createMockRow = () => ({
  id: 'row-1',
  versionId: 'v1',
  data: {},
})

class MockRouterParams {
  public organizationId: string | null = null
  public projectName: string | null = null
  public branchName: string | null = null
  public revisionIdOrTag: string | null = null
  public tableId: string | null = null
  public rowId: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  public setParams(params: Partial<MockRouterParams>): void {
    if (params.organizationId !== undefined) {
      this.organizationId = params.organizationId
    }
    if (params.projectName !== undefined) {
      this.projectName = params.projectName
    }
    if (params.branchName !== undefined) {
      this.branchName = params.branchName
    }
    if (params.revisionIdOrTag !== undefined) {
      this.revisionIdOrTag = params.revisionIdOrTag
    }
    if (params.tableId !== undefined) {
      this.tableId = params.tableId
    }
    if (params.rowId !== undefined) {
      this.rowId = params.rowId
    }
  }
}

interface MockApiClient {
  getProjectForLoader: jest.Mock
  getBranchForLoader: jest.Mock
  getRevisionForLoader: jest.Mock
  getTableForLoader: jest.Mock
  getRowForLoader: jest.Mock
  getRowCountForeignKeysToForLoader: jest.Mock
  getProject: jest.Mock
}

const createMockClient = (): MockApiClient => ({
  getProjectForLoader: jest.fn(),
  getBranchForLoader: jest.fn(),
  getRevisionForLoader: jest.fn(),
  getTableForLoader: jest.fn(),
  getRowForLoader: jest.fn(),
  getRowCountForeignKeysToForLoader: jest.fn(),
  getProject: jest.fn(),
})

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

let mockClient: MockApiClient

jest.mock('src/shared/model/ApiService.ts', () => ({
  get client() {
    return mockClient
  },
  ApiService: jest.fn(),
}))

import { ProjectContext } from '../ProjectContext'

const createMockPermissionContext = (): PermissionContext =>
  ({ setProject: jest.fn(), clearProject: jest.fn() }) as unknown as PermissionContext

const createMockRouterService = (params: MockRouterParams): RouterService => ({ params })

describe('ProjectContext', () => {
  let context: ProjectContext
  let mockParams: MockRouterParams
  let mockPermissionContext: PermissionContext

  const navigateTo = (params: Partial<MockRouterParams>) => {
    runInAction(() => mockParams.setParams(params))
  }

  const setupProject = async (overrides?: Partial<ReturnType<typeof createMockProject>>) => {
    const project = createMockProject(overrides)
    mockClient.getProjectForLoader.mockResolvedValue({ project })
    navigateTo({ organizationId: 'org-1', projectName: 'test-project' })
    await flushPromises()
    return project
  }

  const setupProjectWithDraft = async () => {
    const project = await setupProject()
    navigateTo({ revisionIdOrTag: 'draft' })
    await flushPromises()
    return project
  }

  const setupProjectWithTable = async () => {
    await setupProjectWithDraft()
    navigateTo({ tableId: 'users' })
    await flushPromises()
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockClient = createMockClient()
    mockParams = new MockRouterParams()
    mockPermissionContext = createMockPermissionContext()
    const apiService = { client: mockClient } as unknown as ApiService
    const routerService = createMockRouterService(mockParams)

    context = new ProjectContext(apiService, mockPermissionContext, routerService as never)
  })

  afterEach(() => {
    context.dispose()
  })

  describe('initial state', () => {
    it('should have null values before loading', () => {
      expect(context.projectOrNull).toBeNull()
      expect(context.branchOrNull).toBeNull()
      expect(context.revisionOrNull).toBeNull()
      expect(context.table).toBeNull()
      expect(context.row).toBeNull()
    })

    it('should not be loading initially', () => {
      expect(context.isLoading).toBe(false)
      expect(context.isProjectLoading).toBe(false)
      expect(context.isBranchLoading).toBe(false)
      expect(context.isRevisionLoading).toBe(false)
      expect(context.isTableLoading).toBe(false)
      expect(context.isRowLoading).toBe(false)
    })
  })

  describe('project loading', () => {
    it('should load project when organizationId and projectName are set', async () => {
      const project = await setupProject()

      expect(mockClient.getProjectForLoader).toHaveBeenCalledWith({
        data: { organizationId: 'org-1', projectName: 'test-project' },
      })
      expect(context.projectOrNull).toEqual(project)
    })

    it('should not load project when organizationId is missing', async () => {
      navigateTo({ projectName: 'test-project' })
      await flushPromises()

      expect(mockClient.getProjectForLoader).not.toHaveBeenCalled()
    })

    it('should abort previous request when params change', async () => {
      const project1 = createMockProject({ id: 'project-1' })
      const project2 = createMockProject({ id: 'project-2' })

      let resolveFirst: (value: { project: typeof project1 }) => void
      mockClient.getProjectForLoader
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveFirst = resolve
            }),
        )
        .mockResolvedValueOnce({ project: project2 })

      navigateTo({ organizationId: 'org-1', projectName: 'project-1' })
      await flushPromises()

      navigateTo({ organizationId: 'org-1', projectName: 'project-2' })
      await flushPromises()

      resolveFirst!({ project: project1 })
      await flushPromises()

      expect(context.projectOrNull?.id).toBe('project-2')
    })
  })

  describe('branch loading', () => {
    it('should load branch when all required params are set', async () => {
      const branch = createMockBranch()
      mockClient.getBranchForLoader.mockResolvedValue({ branch })

      navigateTo({ organizationId: 'org-1', projectName: 'test-project', branchName: 'feature' })
      await flushPromises()

      expect(mockClient.getBranchForLoader).toHaveBeenCalledWith({
        data: { organizationId: 'org-1', projectName: 'test-project', branchName: 'feature' },
      })
      expect(context.branchOrNull).toEqual(branch)
    })

    it('should use rootBranch from project when branchName is not set', async () => {
      const project = await setupProject()

      expect(context.branch).toEqual(project.rootBranch)
    })
  })

  describe('revision loading', () => {
    beforeEach(async () => {
      await setupProject()
    })

    it('should use draft revision when revisionIdOrTag is "draft"', async () => {
      navigateTo({ revisionIdOrTag: 'draft' })
      await flushPromises()

      expect(mockClient.getRevisionForLoader).not.toHaveBeenCalled()
      expect(context.revisionOrNull?.id).toBe('draft-1')
    })

    it('should use head revision when revisionIdOrTag is "head"', async () => {
      navigateTo({ revisionIdOrTag: 'head' })
      await flushPromises()

      expect(mockClient.getRevisionForLoader).not.toHaveBeenCalled()
      expect(context.revisionOrNull?.id).toBe('head-1')
    })

    it('should load revision by id when revisionIdOrTag is not a tag', async () => {
      const revision = createMockRevision({ id: 'custom-revision' })
      mockClient.getRevisionForLoader.mockResolvedValue({ revision })

      navigateTo({ revisionIdOrTag: 'custom-revision' })
      await flushPromises()

      expect(mockClient.getRevisionForLoader).toHaveBeenCalledWith({
        data: { revisionId: 'custom-revision' },
      })
      expect(context.revisionOrNull?.id).toBe('custom-revision')
    })
  })

  describe('table loading', () => {
    beforeEach(async () => {
      await setupProjectWithDraft()
    })

    it('should load table when tableId and revision are available', async () => {
      const table = createMockTable()
      mockClient.getTableForLoader.mockResolvedValue({ table })

      navigateTo({ tableId: 'users' })
      await flushPromises()

      expect(mockClient.getTableForLoader).toHaveBeenCalledWith({
        data: { revisionId: 'draft-1', tableId: 'users' },
      })
      expect(context.table).toEqual(table)
    })

    it('should clear table data when tableId is cleared', async () => {
      const table = createMockTable()
      mockClient.getTableForLoader.mockResolvedValue({ table })

      navigateTo({ tableId: 'users' })
      await flushPromises()

      expect(context.table).toEqual(table)

      navigateTo({ tableId: null })
      await flushPromises()

      expect(context.table).toBeNull()
    })
  })

  describe('row loading', () => {
    beforeEach(async () => {
      await setupProjectWithTable()
    })

    it('should load row and foreignKeysCount in parallel', async () => {
      const row = createMockRow()
      mockClient.getRowForLoader.mockResolvedValue({ row })
      mockClient.getRowCountForeignKeysToForLoader.mockResolvedValue({
        row: { countForeignKeysTo: 5 },
      })

      navigateTo({ rowId: 'row-1' })
      await flushPromises()

      expect(mockClient.getRowForLoader).toHaveBeenCalledWith({
        data: { revisionId: 'draft-1', tableId: 'users', rowId: 'row-1' },
      })
      expect(mockClient.getRowCountForeignKeysToForLoader).toHaveBeenCalledWith({
        data: { revisionId: 'draft-1', tableId: 'users', rowId: 'row-1' },
      })
      expect(context.row?.id).toBe('row-1')
      expect(context.row?.foreignKeysCount).toBe(5)
    })

    it('should clear row data when rowId is cleared', async () => {
      const row = createMockRow()
      mockClient.getRowForLoader.mockResolvedValue({ row })
      mockClient.getRowCountForeignKeysToForLoader.mockResolvedValue({
        row: { countForeignKeysTo: 5 },
      })

      navigateTo({ rowId: 'row-1' })
      await flushPromises()

      expect(context.row?.foreignKeysCount).toBe(5)

      navigateTo({ rowId: null })
      await flushPromises()

      expect(context.row).toBeNull()
      expect(context.isRowLoading).toBe(false)
    })
  })

  describe('computed properties', () => {
    it('isDraftRevision should return true when revision equals draft', async () => {
      await setupProjectWithDraft()

      expect(context.isDraftRevision).toBe(true)
      expect(context.isHeadRevision).toBe(false)
    })

    it('isHeadRevision should return true when revision equals head', async () => {
      await setupProject()
      navigateTo({ revisionIdOrTag: 'head' })
      await flushPromises()

      expect(context.isDraftRevision).toBe(false)
      expect(context.isHeadRevision).toBe(true)
    })
  })

  describe('update methods', () => {
    beforeEach(async () => {
      await setupProject()
    })

    it('updateTouched should update branch and project touched state', () => {
      expect(context.branch.touched).toBe(false)

      context.updateTouched(true)

      expect(context.branch.touched).toBe(true)
      expect(context.project.rootBranch.touched).toBe(true)
    })

    it('updateProject should update project data', () => {
      expect(context.project.name).toBe('test-project')

      context.updateProject({ name: 'renamed-project' })

      expect(context.project.name).toBe('renamed-project')
    })
  })

  describe('error handling', () => {
    it('should expose project error', async () => {
      const error = new Error('Project not found')
      ;(error as { response?: { errors: { message: string }[] } }).response = {
        errors: [{ message: 'Project not found' }],
      }
      mockClient.getProjectForLoader.mockRejectedValue(error)

      navigateTo({ organizationId: 'org-1', projectName: 'test-project' })
      await flushPromises()

      expect(context.projectError).toBe('Project not found')
    })
  })

  describe('race conditions', () => {
    it('should handle rapid param changes without race conditions', async () => {
      const projects = [
        createMockProject({ id: 'p1', name: 'project-1' }),
        createMockProject({ id: 'p2', name: 'project-2' }),
        createMockProject({ id: 'p3', name: 'project-3' }),
      ]

      const resolvers: Array<(value: { project: (typeof projects)[0] }) => void> = []

      mockClient.getProjectForLoader.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvers.push(resolve)
          }),
      )

      navigateTo({ organizationId: 'org-1', projectName: 'project-1' })
      await flushPromises()

      navigateTo({ organizationId: 'org-1', projectName: 'project-2' })
      await flushPromises()

      navigateTo({ organizationId: 'org-1', projectName: 'project-3' })
      await flushPromises()

      resolvers[2]({ project: projects[2] })
      await flushPromises()

      resolvers[0]({ project: projects[0] })
      await flushPromises()

      resolvers[1]({ project: projects[1] })
      await flushPromises()

      expect(context.projectOrNull?.id).toBe('p3')
    })

    it('should handle navigation away during loading', async () => {
      const project = createMockProject()
      let resolveProject: (value: { project: typeof project }) => void

      mockClient.getProjectForLoader.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveProject = resolve
          }),
      )

      navigateTo({ organizationId: 'org-1', projectName: 'test-project' })
      await flushPromises()
      expect(context.isProjectLoading).toBe(true)

      navigateTo({ organizationId: null, projectName: null })
      await flushPromises()

      resolveProject!({ project })
      await flushPromises()

      expect(context.projectOrNull).toBeNull()
    })
  })

  describe('dispose', () => {
    it('should clear all data and abort requests', async () => {
      await setupProject()
      expect(context.projectOrNull).not.toBeNull()

      context.dispose()

      expect(mockPermissionContext.clearProject).toHaveBeenCalled()
    })

    it('should stop reacting to param changes after dispose', async () => {
      context.dispose()

      mockClient.getProjectForLoader.mockResolvedValue({ project: createMockProject() })

      navigateTo({ organizationId: 'org-1', projectName: 'new-project' })
      await flushPromises()

      expect(mockClient.getProjectForLoader).toHaveBeenCalledTimes(0)
    })
  })

  describe('getters that throw', () => {
    it('project getter should throw when not loaded', () => {
      expect(() => context.project).toThrow('ProjectContext: project is not loaded')
    })

    it('organization getter should throw when project not loaded', () => {
      expect(() => context.organization).toThrow('ProjectContext: project is not loaded')
    })

    it('branch getter should throw when project not loaded', () => {
      expect(() => context.branch).toThrow('ProjectContext: project is not loaded')
    })

    it('revision getter should throw when branch not available', () => {
      expect(() => context.revision).toThrow('ProjectContext: project is not loaded')
    })
  })
})
