import { RowStackItemBaseDeps } from '../items/RowStackItemBase.ts'
import { RowCreatingItemDeps } from '../items/RowCreatingItem.ts'
import { RowUpdatingItemDeps } from '../items/RowUpdatingItem.ts'
import { RowStackManagerDeps } from '../RowStackManager.ts'

export interface MockDepsOverrides {
  isDraftRevision?: boolean
  canCreateRow?: boolean
  revisionId?: string
  branchDraftId?: string
  touched?: boolean
  tableId?: string
}

const defaultSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', default: '' },
  },
  additionalProperties: false,
  required: ['name'],
}

const createBaseMockDeps = (overrides: MockDepsOverrides = {}): RowStackItemBaseDeps => ({
  projectContext: {
    isDraftRevision: overrides.isDraftRevision ?? true,
    revision: { id: overrides.revisionId ?? 'rev-1' },
    branch: {
      draft: { id: overrides.branchDraftId ?? 'draft-1' },
      touched: overrides.touched ?? false,
    },
    updateTouched: jest.fn(),
  } as never,
  permissionContext: {
    canCreateRow: overrides.canCreateRow ?? true,
  } as never,
  tableId: overrides.tableId ?? 'test-table',
})

export const createMockBaseDeps = (overrides: MockDepsOverrides = {}): RowStackItemBaseDeps => {
  return createBaseMockDeps(overrides)
}

export const createMockCreatingDeps = (overrides: MockDepsOverrides = {}): RowCreatingItemDeps => ({
  ...createBaseMockDeps(overrides),
  mutationDataSource: {
    createRow: jest.fn(),
    dispose: jest.fn(),
  } as never,
  rowListRefreshService: {
    refresh: jest.fn(),
  } as never,
})

export const createMockUpdatingDeps = (overrides: MockDepsOverrides = {}): RowUpdatingItemDeps => ({
  ...createBaseMockDeps(overrides),
  mutationDataSource: {
    updateRow: jest.fn(),
    renameRow: jest.fn(),
    dispose: jest.fn(),
  } as never,
  rowListRefreshService: {
    refresh: jest.fn(),
  } as never,
})

export const createMockManagerDeps = (overrides: MockDepsOverrides = {}): RowStackManagerDeps => ({
  ...createBaseMockDeps(overrides),
  mutationDataSource: {
    createRow: jest.fn(),
    updateRow: jest.fn(),
    renameRow: jest.fn(),
    dispose: jest.fn(),
  } as never,
  rowListRefreshService: {
    refresh: jest.fn(),
  } as never,
  fetchDataSourceFactory: () =>
    ({
      fetch: jest.fn().mockResolvedValue({
        rowId: 'row-1',
        data: { name: 'Test' },
        schema: defaultSchema,
        foreignKeysCount: 0,
      }),
      dispose: jest.fn(),
    }) as never,
  foreignKeyTableDataSourceFactory: () =>
    ({
      loadTableWithRows: jest.fn().mockResolvedValue({
        table: { id: 'fk-table', schema: defaultSchema },
        rows: [],
      }),
      dispose: jest.fn(),
    }) as never,
  schema: defaultSchema as never,
})

export interface MockRowDataCardStore {
  name: {
    getPlainValue: jest.Mock
    setValue: jest.Mock
    baseValue: string
    value: string
    touched: boolean
  }
  root: {
    getPlainValue: jest.Mock
    touched: boolean
  }
  save: jest.Mock
  reset: jest.Mock
  syncReadOnlyStores: jest.Mock
}

export const createMockRowDataCardStore = (): MockRowDataCardStore => {
  return {
    name: {
      getPlainValue: jest.fn().mockReturnValue('test-row'),
      setValue: jest.fn(),
      baseValue: 'test-row',
      value: 'test-row',
      touched: false,
    },
    root: {
      getPlainValue: jest.fn().mockReturnValue({ name: 'Test' }),
      touched: false,
    },
    save: jest.fn(),
    reset: jest.fn(),
    syncReadOnlyStores: jest.fn(),
  }
}
