import { observable } from 'mobx'
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
  schema?: JsonObjectSchema
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

export const createMockProjectContext = (overrides: MockDepsOverrides = {}) => {
  const isDraft = overrides.isDraftRevision ?? true
  const branchDraftId = overrides.branchDraftId ?? 'draft-1'
  const revisionId = overrides.revisionId ?? 'rev-1'

  const branchData = {
    draft: { id: branchDraftId },
    touched: overrides.touched ?? false,
  }

  const computedRevisionId = isDraft ? branchDraftId : revisionId

  const context = observable(
    {
      revisionId: computedRevisionId,
      isDraftRevision: isDraft,
      branchOrNull: branchData,
      isLoading: false,
    },
    {},
    { deep: false },
  )

  return Object.assign(context, { updateTouched: jest.fn() })
}

export const createMockRouterParams = (overrides: MockDepsOverrides = {}) => {
  return {
    tableId: overrides.tableId ?? 'test-table',
    rowId: overrides.row?.id ?? null,
  }
}

const createBaseMockDeps = (overrides: MockDepsOverrides = {}): RowStackItemBaseDeps => ({
  projectContext: createMockProjectContext(overrides) as never,
  projectPermissions: {
    canCreateRow: overrides.canCreateRow ?? true,
  } as never,
  tableId: overrides.tableId ?? 'test-table',
})

export const createMockBaseDeps = (overrides: MockDepsOverrides = {}): RowStackItemBaseDeps => {
  return createBaseMockDeps(overrides)
}

export const createMockNotifications = (): RowEditorNotifications => ({
  onCopySuccess: jest.fn(),
  onCopyError: jest.fn(),
  onUploadStart: jest.fn().mockReturnValue('toast-id'),
  onUploadSuccess: jest.fn(),
  onUploadError: jest.fn(),
})

export const createMockNavigation = (): RowEditorNavigation => ({
  navigateToRow: jest.fn<void, [string, string]>(),
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

  const cache = new ForeignSchemaCache(factory as never)
  return cache
}

const createMockItemFactory = (
  projectContext: ReturnType<typeof createMockProjectContext>,
  schemaCache: ForeignSchemaCache,
  overrides: MockDepsOverrides = {},
): RowStackItemFactory => {
  const factoryDeps: RowStackItemFactoryDeps = {
    projectContext: projectContext as never,
    projectPermissions: {
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
  const projectContext = createMockProjectContext(overrides)
  const routerParams = createMockRouterParams(overrides)
  const schemaCache = createMockSchemaCache()

  return {
    projectContext: projectContext as never,
    routerParams: routerParams as never,
    itemFactory: createMockItemFactory(projectContext, schemaCache, overrides),
    schemaCache,
    fetchDataSourceFactory: () =>
      ({
        fetch: jest.fn().mockResolvedValue({
          rowId: overrides.row?.id ?? 'row-1',
          data: overrides.row?.data ?? { name: 'Test' },
          schema: defaultSchema,
          foreignKeysCount: overrides.row?.foreignKeysCount ?? 0,
        }),
        dispose: jest.fn(),
      }) as never,
    tableFetchDataSourceFactory: () =>
      ({
        fetch: jest.fn().mockResolvedValue({
          id: overrides.tableId ?? 'test-table',
          schema: overrides.schema ?? defaultSchema,
        }),
        dispose: jest.fn(),
      }) as never,
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
  dispose: jest.Mock
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
    dispose: jest.fn(),
  }
}
