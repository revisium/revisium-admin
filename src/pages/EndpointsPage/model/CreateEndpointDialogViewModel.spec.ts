import { EndpointType } from 'src/__generated__/graphql-request'
import { BranchWithRevisions, EndpointsDataSource } from '../api/EndpointsDataSource'
import { CreateEndpointDialogViewModel } from './CreateEndpointDialogViewModel'

jest.mock('src/shared/model/ApiService', () => ({
  client: {
    getBranchRevisions: jest.fn().mockResolvedValue({
      branch: {
        revisions: {
          edges: [],
        },
      },
    }),
  },
}))

const createMockContext = () => ({
  organizationId: 'org1',
  projectName: 'project1',
})

const createMockDataSource = () =>
  ({
    createEndpoint: jest.fn(),
  }) as unknown as EndpointsDataSource

const createMockBranches = (): BranchWithRevisions[] => [
  {
    id: 'branch-1',
    name: 'main',
    isRoot: true,
    headRevisionId: 'head-1',
    draftRevisionId: 'draft-1',
  },
  {
    id: 'branch-2',
    name: 'feature',
    isRoot: false,
    headRevisionId: 'head-2',
    draftRevisionId: 'draft-2',
  },
]

describe('CreateEndpointDialogViewModel', () => {
  describe('initial state', () => {
    it('should be closed by default', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      expect(vm.isOpen).toBe(false)
    })

    it('should have no selected branch or revision', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      expect(vm.selectedBranchId).toBeNull()
      expect(vm.selectedRevisionId).toBeNull()
    })

    it('should default to GraphQL type', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      expect(vm.selectedType).toBe(EndpointType.Graphql)
    })

    it('should not be creating initially', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      expect(vm.isCreating).toBe(false)
    })

    it('should not be loading revisions initially', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      expect(vm.isLoadingRevisions).toBe(false)
    })
  })

  describe('open/close', () => {
    it('should open dialog', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      vm.open()

      expect(vm.isOpen).toBe(true)
    })

    it('should reset type to GraphQL on open', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      vm.selectType(EndpointType.RestApi)
      vm.open()

      expect(vm.selectedType).toBe(EndpointType.Graphql)
    })

    it('should close dialog', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      vm.open()
      vm.close()

      expect(vm.isOpen).toBe(false)
    })
  })

  describe('branchOptions', () => {
    it('should return branch options with isRoot flag', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      const options = vm.branchOptions

      expect(options).toHaveLength(2)
      expect(options[0]).toEqual({ id: 'branch-1', name: 'main', isRoot: true })
      expect(options[1]).toEqual({ id: 'branch-2', name: 'feature', isRoot: false })
    })
  })

  describe('selectType', () => {
    it('should update selected type to REST API', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      vm.selectType(EndpointType.RestApi)

      expect(vm.selectedType).toBe(EndpointType.RestApi)
    })

    it('should update selected type to GraphQL', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      vm.selectType(EndpointType.RestApi)
      vm.selectType(EndpointType.Graphql)

      expect(vm.selectedType).toBe(EndpointType.Graphql)
    })
  })

  describe('selectRevision', () => {
    it('should update selected revision', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      vm.selectRevision('revision-1')

      expect(vm.selectedRevisionId).toBe('revision-1')
    })
  })

  describe('canCreate', () => {
    it('should return false when no revision selected', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      expect(vm.canCreate).toBe(false)
    })

    it('should return false when revision selected but not in options', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      vm.selectRevision('non-existent-revision')

      expect(vm.canCreate).toBe(false)
    })
  })

  describe('hasNoCustomRevisions', () => {
    it('should return false when no branch selected', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      expect(vm.hasNoCustomRevisions).toBe(false)
    })
  })

  describe('selectedRevisionHasEndpoint', () => {
    it('should return false when no revision selected', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      expect(vm.selectedRevisionHasEndpoint).toBe(false)
    })

    it('should return false when revision not in options', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      vm.selectRevision('non-existent')

      expect(vm.selectedRevisionHasEndpoint).toBe(false)
    })
  })

  describe('create', () => {
    it('should not create when canCreate is false', async () => {
      const dataSource = createMockDataSource()
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        dataSource,
        createMockBranches(),
        jest.fn(),
      )

      await vm.create()

      expect(dataSource.createEndpoint).not.toHaveBeenCalled()
    })

    it('should not create when no revision selected', async () => {
      const dataSource = createMockDataSource()
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        dataSource,
        createMockBranches(),
        jest.fn(),
      )

      vm.open()
      await vm.create()

      expect(dataSource.createEndpoint).not.toHaveBeenCalled()
    })
  })

  describe('revisionOptions', () => {
    it('should return empty array initially', () => {
      const vm = new CreateEndpointDialogViewModel(
        createMockContext() as never,
        createMockDataSource(),
        createMockBranches(),
        jest.fn(),
      )

      expect(vm.revisionOptions).toEqual([])
    })
  })
})
