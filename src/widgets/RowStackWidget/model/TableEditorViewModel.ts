import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { generatePath } from 'react-router-dom'
import { JsonObjectSchema, RefSchemas } from '@revisium/schema-toolkit'
import {
  TableEditorCore,
  type TableEditorBreadcrumb,
  type TableEditorCallbacks,
  type SearchForeignKeySearchFn,
} from '@revisium/schema-toolkit-ui'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { schemaRefsMapper } from 'src/entities/Schema'
import { IViewModel } from 'src/shared/config/types.ts'
import { TABLE_ROUTE } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { RouterService } from 'src/shared/model/RouterService.ts'
import { toaster } from 'src/shared/ui'
import { createSearchForeignKey } from './createSearchForeignKey.ts'
import { RevisiumTableDataSource } from './RevisiumTableDataSource.ts'

export class TableEditorViewModel implements IViewModel {
  private _core: TableEditorCore | null = null

  constructor(
    private readonly _projectContext: ProjectContext,
    private readonly _projectPermissions: ProjectPermissions,
    private readonly _dataSource: RevisiumTableDataSource,
    private readonly _searchForeignKey: SearchForeignKeySearchFn,
    private readonly _linkMaker: LinkMaker,
    private readonly _routerService: RouterService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get core(): TableEditorCore | null {
    return this._core
  }

  public get canCreateRow(): boolean {
    return this._projectContext.isDraftRevision && this._projectPermissions.canCreateRow
  }

  public init(
    tableId: string,
    schema: JsonObjectSchema,
    callbacks: {
      onCreateRow?: () => void
      onOpenRow?: (rowId: string) => void
      onDuplicateRow?: (rowId: string) => void
    },
  ): void {
    this.dispose()

    this._dataSource.init(tableId, schema, schemaRefsMapper as RefSchemas)

    const breadcrumbs = this._buildBreadcrumbs(tableId)

    const editorCallbacks: TableEditorCallbacks = {
      onBreadcrumbClick: (_segment, index) => this._handleBreadcrumbClick(tableId, index),
      onCreateRow: callbacks.onCreateRow,
      onOpenRow: callbacks.onOpenRow,
      onDuplicateRow: callbacks.onDuplicateRow,
      onSearchForeignKey: this._searchForeignKey,
      onUploadFile: (params) => this._handleUploadFile(params),
      onOpenFile: (url) => window.open(url, '_blank'),
      onReadonlyEditAttempt: () => toaster.info({ title: 'This cell is read-only', duration: 2000 }),
    }

    this._core = new TableEditorCore(this._dataSource, {
      tableId,
      breadcrumbs,
      callbacks: editorCallbacks,
    })
  }

  public dispose(): void {
    this._core?.dispose()
    this._core = null
  }

  private async _handleUploadFile(params: {
    rowId: string
    fileId: string
    file: File
  }): Promise<Record<string, unknown> | null> {
    const toastId = nanoid()
    toaster.loading({ id: toastId, title: 'Uploading...' })

    const rowData = await this._dataSource.uploadFile(params)

    if (rowData) {
      toaster.update(toastId, { type: 'info', title: 'Successfully uploaded!', duration: 1500 })
      return this._extractFileFieldData(params.fileId, rowData)
    }

    toaster.update(toastId, { type: 'error', title: 'Upload failed', duration: 3000 })
    return null
  }

  private _extractFileFieldData(fileId: string, rowData: Record<string, unknown>): Record<string, unknown> | null {
    for (const value of Object.values(rowData)) {
      if (typeof value === 'object' && value !== null && (value as Record<string, unknown>).fileId === fileId) {
        return value as Record<string, unknown>
      }
    }
    return null
  }

  private _buildBreadcrumbs(tableId: string): TableEditorBreadcrumb[] {
    return [
      { label: 'Database', dataTestId: 'breadcrumb-branch-tables' },
      { label: tableId, dataTestId: `breadcrumb-table-${tableId}` },
    ]
  }

  private _handleBreadcrumbClick(tableId: string, index: number): void {
    if (index === 0) {
      const href = this._linkMaker.currentBaseLink
      if (href) {
        void this._routerService.navigate(href)
      }
    } else if (index === 1) {
      const href = generatePath(`${this._linkMaker.currentBaseLink}/${TABLE_ROUTE}`, { tableId })
      if (href) {
        void this._routerService.navigate(href)
      }
    }
  }
}

container.register(
  TableEditorViewModel,
  () => {
    const projectContext = container.get(ProjectContext)
    const projectPermissions = container.get(ProjectPermissions)
    const dataSource = container.get(RevisiumTableDataSource)
    const searchForeignKey = createSearchForeignKey(projectContext)
    const linkMaker = container.get(LinkMaker)
    const routerService = container.get(RouterService)
    return new TableEditorViewModel(
      projectContext,
      projectPermissions,
      dataSource,
      searchForeignKey,
      linkMaker,
      routerService,
    )
  },
  { scope: 'request' },
)
