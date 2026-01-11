import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { TableFetchDataSource } from '../TableFetchDataSource.ts'
import { TableStackItemBaseDeps } from '../items/TableStackItemBase.ts'
import { TableCreatingItemDeps } from '../items/TableCreatingItem.ts'
import { TableUpdatingItemDeps } from '../items/TableUpdatingItem.ts'
import { TableStackManagerDeps } from '../TableStackManager.ts'

export interface MockDepsOverrides {
  isDraftRevision?: boolean
  canCreateTable?: boolean
  revisionId?: string
  touched?: boolean
}

const createBaseMockDeps = (overrides: MockDepsOverrides = {}): TableStackItemBaseDeps => {
  const isDraft = overrides.isDraftRevision ?? true
  const revisionId = overrides.revisionId ?? 'draft-1'

  const projectContext: Pick<
    ProjectContext,
    'revisionId' | 'isDraftRevision' | 'isLoading' | 'touched' | 'updateTouched'
  > = {
    revisionId,
    isDraftRevision: isDraft,
    isLoading: false,
    touched: overrides.touched ?? false,
    updateTouched: jest.fn(),
  }

  const projectPermissions: Pick<ProjectPermissions, 'canCreateTable'> = {
    canCreateTable: overrides.canCreateTable ?? true,
  }

  const fetchDataSourceFactory = (): Pick<TableFetchDataSource, 'fetch' | 'dispose'> => ({
    fetch: jest.fn().mockResolvedValue({
      id: 'table-1',
      schema: { type: 'object', properties: {}, additionalProperties: false, required: [] },
    }),
    dispose: jest.fn(),
  })

  return {
    projectContext: projectContext as ProjectContext,
    projectPermissions: projectPermissions as ProjectPermissions,
    fetchDataSourceFactory: fetchDataSourceFactory as () => TableFetchDataSource,
  }
}

export const createMockBaseDeps = (overrides: MockDepsOverrides = {}): TableStackItemBaseDeps => {
  return createBaseMockDeps(overrides)
}

export const createMockCreatingDeps = (overrides: MockDepsOverrides = {}): TableCreatingItemDeps => ({
  ...createBaseMockDeps(overrides),
  mutationDataSource: {
    createTable: jest.fn(),
    dispose: jest.fn(),
  } as never,
  tableListRefreshService: {
    refresh: jest.fn(),
  } as never,
})

export const createMockUpdatingDeps = (overrides: MockDepsOverrides = {}): TableUpdatingItemDeps => ({
  ...createBaseMockDeps(overrides),
  mutationDataSource: {
    updateTable: jest.fn(),
    renameTable: jest.fn(),
    dispose: jest.fn(),
  } as never,
  tableListRefreshService: {
    refresh: jest.fn(),
  } as never,
})

export const createMockManagerDeps = (overrides: MockDepsOverrides = {}): TableStackManagerDeps => ({
  ...createBaseMockDeps(overrides),
  mutationDataSource: {
    createTable: jest.fn(),
    updateTable: jest.fn(),
    renameTable: jest.fn(),
    dispose: jest.fn(),
  } as never,
  tableListRefreshService: {
    refresh: jest.fn(),
  } as never,
})
