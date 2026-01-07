import { nanoid } from 'nanoid'
import { container } from 'src/shared/lib/DIContainer.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { RowListRefreshService } from 'src/widgets/RowList/model/RowListRefreshService.ts'
import { ForeignKeyTableDataSource } from 'src/widgets/RowStackWidget/model/ForeignKeyTableDataSource.ts'
import { DRAFT_TAG } from 'src/shared/config/routes.ts'
import { toaster } from 'src/shared/ui'
import { RouterService } from 'src/shared/model/RouterService.ts'
import { RowDataCardStoreFactory } from './RowDataCardStoreFactory.ts'
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

const createNavigation = (projectContext: ProjectContext): RowEditorNavigation => {
  const linkMaker = new LinkMaker(projectContext)
  const routerService = container.get(RouterService)

  return {
    navigateToRow: (rowId: string) => {
      const path = linkMaker.make({ revisionIdOrTag: DRAFT_TAG, rowId })
      routerService.navigate(path)
    },
  }
}

const createItemFactory = (projectContext: ProjectContext, schemaCache: ForeignSchemaCache): RowStackItemFactory => {
  return new RowStackItemFactory({
    projectContext,
    permissionContext: container.get(PermissionContext),
    mutationDataSource: container.get(RowMutationDataSource),
    rowListRefreshService: container.get(RowListRefreshService),
    storeFactory: container.get(RowDataCardStoreFactory),
    schemaCache,
    notifications: createNotifications(),
    navigation: createNavigation(projectContext),
  })
}

const createRowStackManager = (): RowStackManager => {
  const projectContext = container.get(ProjectContext)
  const schemaCache = createSchemaCache()
  const itemFactory = createItemFactory(projectContext, schemaCache)

  return new RowStackManager({
    projectContext,
    itemFactory,
    schemaCache,
    fetchDataSourceFactory: () => container.get(RowFetchDataSource),
    onError: (message) => toaster.error({ title: message }),
  })
}

container.register(RowStackManager, createRowStackManager, { scope: 'request' })
