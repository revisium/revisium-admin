import { JsonObjectSchema } from 'src/entities/Schema'
import { RowStackItemBaseDeps } from '../items/RowStackItemBase.ts'
import { RowCreatingItemDeps } from '../items/RowCreatingItem.ts'
import { RowUpdatingItemDeps } from '../items/RowUpdatingItem.ts'
import { RowStackManagerDeps } from '../RowStackManager.ts'
import { RowStackItemFactory, RowStackItemFactoryDeps } from '../RowStackItemFactory.ts'
import { ForeignSchemaCache } from '../ForeignSchemaCache.ts'
import { RowData, RowEditorNavigation, RowEditorNotifications } from '../../config/types.ts'

export interface MockRow {
  id: string
  data: unknown
  foreignKeysCount: number
}

export interface MockDepsOverrides {
  isDraftRevision?: boolean
  canCreateRow?: boolean
  revisionId?: string
  branchDraftId?: string
  touched?: boolean
  tableId?: string
  rowData?: RowData
  row?: MockRow | null
}

const defaultSchema: JsonObjectSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', default: '' },
  },
  additionalProperties: false,
  required: ['name'],
} as JsonObjectSchema

const createMockProjectContext = (overrides: MockDepsOverrides = {}) => ({
  isDraftRevision: overrides.isDraftRevision ?? true,
  revision: { id: overrides.revisionId ?? 'rev-1' },
  branch: {
    draft: { id: overrides.branchDraftId ?? 'draft-1' },
    touched: overrides.touched ?? false,
  },
  row: overrides.row ?? null,
  updateTouched: jest.fn(),
})

const createBaseMockDeps = (overrides: MockDepsOverrides = {}): RowStackItemBaseDeps => ({
  projectContext: createMockProjectContext(overrides) as never,
  permissionContext: {
    canCreateRow: overrides.canCreateRow ?? true,
  } as never,
  tableId: overrides.tableId ?? 'test-table',
})

export const createMockBaseDeps = (overrides: MockDepsOverrides = {}): RowStackItemBaseDeps => {
  return createBaseMockDeps(overrides)
}

export const createMockNotifications = (): RowEditorNotifications => ({
  onCopySuccess: jest.fn(),
  onUploadStart: jest.fn().mockReturnValue('toast-id'),
  onUploadSuccess: jest.fn(),
  onUploadError: jest.fn(),
  onCreateError: jest.fn(),
  onUpdateError: jest.fn(),
})

export const createMockNavigation = (): RowEditorNavigation => ({
  navigateToRow: jest.fn(),
})

export const createMockCreatingDeps = (overrides: MockDepsOverrides = {}): RowCreatingItemDeps => ({
  ...createBaseMockDeps(overrides),
  mutationDataSource: {
    createRow: jest.fn(),
    dispose: jest.fn(),
  } as never,
  rowListRefreshService: {
    refresh: jest.fn(),
  } as never,
  notifications: createMockNotifications(),
  navigation: createMockNavigation(),
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
  notifications: createMockNotifications(),
  navigation: createMockNavigation(),
})

const createMockStoreFactory = () => ({
  createEmpty: jest.fn().mockReturnValue(createMockRowDataCardStore()),
  createFromClone: jest.fn().mockReturnValue(createMockRowDataCardStore()),
  createForUpdating: jest.fn().mockReturnValue(createMockRowDataCardStore()),
})

export const createMockSchemaCache = (
  tableId: string,
  dataSourceFactory?: () => { loadTableWithRows: jest.Mock; dispose: jest.Mock },
) => {
  const factory =
    dataSourceFactory ??
    (() => ({
      loadTableWithRows: jest.fn().mockResolvedValue({
        table: { id: 'fk-table', schema: defaultSchema },
        rows: [],
      }),
      dispose: jest.fn(),
    }))

  const cache = new ForeignSchemaCache(tableId, defaultSchema, factory as never)
  return cache
}

const createMockItemFactory = (overrides: MockDepsOverrides = {}): RowStackItemFactory => {
  const tableId = overrides.tableId ?? 'test-table'
  const schemaCache = createMockSchemaCache(tableId)

  const factoryDeps: RowStackItemFactoryDeps = {
    projectContext: createMockProjectContext(overrides) as never,
    permissionContext: {
      canCreateRow: overrides.canCreateRow ?? true,
    } as never,
    mutationDataSource: {
      createRow: jest.fn(),
      updateRow: jest.fn(),
      renameRow: jest.fn(),
      dispose: jest.fn(),
    } as never,
    rowListRefreshService: {
      refresh: jest.fn(),
    } as never,
    storeFactory: createMockStoreFactory() as never,
    schemaCache,
    notifications: createMockNotifications(),
    navigation: createMockNavigation(),
  }

  return new RowStackItemFactory(factoryDeps)
}

export const createMockManagerDeps = (overrides: MockDepsOverrides = {}): RowStackManagerDeps => {
  const tableId = overrides.tableId ?? 'test-table'
  const schemaCache = createMockSchemaCache(tableId)

  return {
    projectContext: createMockProjectContext(overrides) as never,
    itemFactory: createMockItemFactory(overrides),
    schemaCache,
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
    tableId,
    rowData: overrides.rowData,
  }
}

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
