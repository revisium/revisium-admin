import { nanoid } from 'nanoid'
import { type ForeignKeySearchResult } from '@revisium/schema-toolkit-ui'
import { container } from 'src/shared/lib/DIContainer.ts'
import { SearchIn, SearchType } from 'src/__generated__/graphql-request.ts'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { RowListRefreshService } from 'src/widgets/RowList/model/RowListRefreshService.ts'
import { ForeignKeyTableDataSource } from 'src/widgets/RowStackWidget/model/ForeignKeyTableDataSource.ts'
import { DRAFT_TAG } from 'src/shared/config/routes.ts'
import { toaster } from 'src/shared/ui'
import { RouterService } from 'src/shared/model/RouterService.ts'
import { RouterParams } from 'src/shared/model/RouterParams.ts'
import { TableFetchDataSource } from 'src/pages/RevisionPage/model/TableFetchDataSource.ts'
import { ForeignSchemaCache } from './ForeignSchemaCache.ts'
import { RowStackItemFactory } from './RowStackItemFactory.ts'
import { RowFetchDataSource } from './RowFetchDataSource.ts'
import { RowStackManager } from './RowStackManager.ts'
import { RowEditorNavigation, RowEditorNotifications } from '../config/types.ts'

const createSchemaCache = (): ForeignSchemaCache => {
  return new ForeignSchemaCache(() => container.get(ForeignKeyTableDataSource))
}

const createNotifications = (): RowEditorNotifications => ({
  onCopySuccess: () => toaster.info({ title: 'Copied to clipboard' }),
  onCopyError: () => toaster.error({ title: 'Failed to copy to clipboard' }),
  onUploadStart: () => {
    const toastId = nanoid()
    toaster.loading({ id: toastId, title: 'Uploading...' })
    return toastId
  },
  onUploadSuccess: (toastId: string) => {
    toaster.update(toastId, { type: 'info', title: 'Successfully uploaded!', duration: 1500 })
  },
  onUploadError: (toastId: string) => {
    toaster.update(toastId, { type: 'error', title: 'Upload failed', duration: 3000 })
  },
})

const createNavigation = (): RowEditorNavigation => {
  const linkMaker = container.get(LinkMaker)
  const routerService = container.get(RouterService)

  return {
    navigateToRow: (tableId: string, rowId: string) => {
      const path = linkMaker.make({ revisionIdOrTag: DRAFT_TAG, tableId, rowId })
      routerService.navigate(path)
    },
  }
}

const createSearchForeignKey = (projectContext: ProjectContext) => {
  return async (tableId: string, search: string): Promise<ForeignKeySearchResult> => {
    const result = await client.findForeignKey({
      data: {
        first: 100,
        revisionId: projectContext.revisionId,
        tableId,
        where: search
          ? {
              OR: [
                { id: { contains: search } },
                { data: { path: [], search, searchType: SearchType.Plain, searchIn: SearchIn.Values } },
              ],
            }
          : undefined,
      },
    })

    return {
      ids: result.rows.edges.map((edge) => edge.node.id),
      hasMore: result.rows.pageInfo.hasNextPage,
    }
  }
}

const createRowStackManager = (): RowStackManager => {
  const projectContext = container.get(ProjectContext)
  const routerParams = container.get(RouterParams)
  const schemaCache = createSchemaCache()

  const managerRef: { current: RowStackManager | null } = { current: null }

  const itemFactory = new RowStackItemFactory({
    projectContext,
    projectPermissions: container.get(ProjectPermissions),
    mutationDataSource: container.get(RowMutationDataSource),
    rowListRefreshService: container.get(RowListRefreshService),
    schemaCache,
    notifications: createNotifications(),
    navigation: createNavigation(),
    searchForeignKey: createSearchForeignKey(projectContext),
    requestForeignKeySelection: (item, foreignTableId) =>
      managerRef.current!.requestForeignKeySelection(item, foreignTableId),
    requestForeignKeyCreation: (item, foreignTableId) =>
      managerRef.current!.requestForeignKeyCreation(item, foreignTableId),
  })

  const manager = new RowStackManager({
    projectContext,
    routerParams,
    itemFactory,
    schemaCache,
    fetchDataSourceFactory: () => container.get(RowFetchDataSource),
    tableFetchDataSourceFactory: () => container.get(TableFetchDataSource),
    onError: (message) => toaster.error({ title: message }),
  })

  managerRef.current = manager

  return manager
}

container.register(RowStackManager, createRowStackManager, { scope: 'request' })
