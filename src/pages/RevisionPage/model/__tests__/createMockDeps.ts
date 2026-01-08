import { TableStackItemBaseDeps } from '../items/TableStackItemBase.ts'
import { TableCreatingItemDeps } from '../items/TableCreatingItem.ts'
import { TableUpdatingItemDeps } from '../items/TableUpdatingItem.ts'
import { TableStackManagerDeps } from '../TableStackManager.ts'

export interface MockDepsOverrides {
  isDraftRevision?: boolean
  canCreateTable?: boolean
  revisionId?: string
  branchDraftId?: string
  touched?: boolean
}

const createBaseMockDeps = (overrides: MockDepsOverrides = {}): TableStackItemBaseDeps => {
  const isDraft = overrides.isDraftRevision ?? true
  const revisionId = overrides.revisionId ?? 'rev-1'
  const branchDraftId = overrides.branchDraftId ?? 'draft-1'

  const branchData = {
    draft: { id: branchDraftId },
    touched: overrides.touched ?? false,
  }

  return {
    projectContext: {
      revisionId: isDraft ? branchDraftId : revisionId,
      revisionOrNull: { id: isDraft ? branchDraftId : revisionId },
      branchOrNull: branchData,
      isDraftRevision: isDraft,
      isLoading: false,
      updateTouched: jest.fn(),
    } as never,
    permissionContext: {
      canCreateTable: overrides.canCreateTable ?? true,
    } as never,
    fetchDataSourceFactory: () =>
      ({
        fetch: jest.fn().mockResolvedValue({
          id: 'table-1',
          schema: { type: 'object', properties: {}, additionalProperties: false, required: [] },
        }),
        dispose: jest.fn(),
      }) as never,
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
