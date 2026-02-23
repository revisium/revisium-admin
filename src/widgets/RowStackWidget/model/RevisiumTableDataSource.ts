import { JsonObjectSchema, RefSchemas } from '@revisium/schema-toolkit'
import type {
  CellPatch,
  CellPatchResult,
  DeleteRowsResult,
  FetchRowsResult,
  ITableDataSource,
  RowDataItem,
  TableMetadata,
  TableQuery,
  ViewState,
} from '@revisium/schema-toolkit-ui'
import {
  GetTableViewsQuery,
  OrderBy,
  OrderByField,
  OrderDataType,
  PatchRowOp,
  SearchIn,
  SearchType,
  Scalars,
  SortOrder,
  ViewInput,
} from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'
import { FileService } from 'src/shared/model/FileService.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'

type ViewsData = NonNullable<GetTableViewsQuery['table']>['views']

export class RevisiumTableDataSource implements ITableDataSource {
  private _tableId = ''
  private _schema: JsonObjectSchema = { type: 'object', properties: {}, additionalProperties: false, required: [] }
  private _refSchemas: RefSchemas | undefined
  private _cachedViewsData: ViewsData | null = null

  private static readonly SYSTEM_ORDER_FIELDS: Record<string, OrderByField> = {
    id: OrderByField.Id,
    createdAt: OrderByField.CreatedAt,
    updatedAt: OrderByField.UpdatedAt,
    publishedAt: OrderByField.PublishedAt,
  }

  constructor(
    private readonly _projectContext: ProjectContext,
    private readonly _fileService: FileService,
  ) {}

  private get _revisionId(): string {
    return this._projectContext.revisionId
  }

  public init(tableId: string, schema: JsonObjectSchema, refSchemas?: RefSchemas): void {
    this._tableId = tableId
    this._schema = schema
    this._refSchemas = refSchemas
    this._cachedViewsData = null
  }

  public async fetchMetadata(): Promise<TableMetadata> {
    const viewState = await this._loadViewState()
    return {
      dataSchema: this._schema,
      viewState,
      readonly: !this._projectContext.isDraftRevision,
      refSchemas: this._refSchemas,
    }
  }

  public async fetchRows(query: TableQuery): Promise<FetchRowsResult> {
    const where = this._buildWhereClause(query.where, query.search)
    const orderBy = this._mapOrderBy(query.orderBy)

    const result = await client.RowListRows({
      data: {
        revisionId: this._revisionId,
        tableId: this._tableId,
        first: query.first,
        after: query.after ?? undefined,
        where,
        orderBy,
      },
    })

    return {
      rows: result.rows.edges.map(
        (edge): RowDataItem => ({
          rowId: edge.node.id,
          data: (edge.node.data ?? {}) as Record<string, unknown>,
          systemFields: {
            createdAt: edge.node.createdAt,
            updatedAt: edge.node.updatedAt,
            publishedAt: edge.node.publishedAt,
            versionId: edge.node.versionId,
            createdId: edge.node.createdId,
          },
        }),
      ),
      totalCount: result.rows.totalCount,
      hasNextPage: result.rows.pageInfo.hasNextPage,
      endCursor: result.rows.pageInfo.endCursor ?? null,
    }
  }

  public async patchCells(patches: CellPatch[]): Promise<CellPatchResult[]> {
    const byRow = new Map<string, CellPatch[]>()
    for (const p of patches) {
      const arr = byRow.get(p.rowId) ?? []
      arr.push(p)
      byRow.set(p.rowId, arr)
    }

    const results: CellPatchResult[] = []

    for (const [rowId, rowPatches] of byRow) {
      try {
        await client.PatchRowInline({
          data: {
            revisionId: this._revisionId,
            tableId: this._tableId,
            rowId,
            patches: rowPatches.map((p) => ({
              op: PatchRowOp.Replace,
              path: p.field,
              value: p.value as Scalars['JSON']['input'],
            })),
          },
        })
        for (const p of rowPatches) {
          results.push({ rowId: p.rowId, field: p.field, ok: true })
        }
      } catch {
        for (const p of rowPatches) {
          results.push({ rowId: p.rowId, field: p.field, ok: false, error: 'Patch failed' })
        }
      }
    }

    return results
  }

  public async deleteRows(rowIds: string[]): Promise<DeleteRowsResult> {
    try {
      if (rowIds.length === 1) {
        await client.DeleteRow({
          data: { revisionId: this._revisionId, tableId: this._tableId, rowId: rowIds[0] },
        })
      } else {
        await client.DeleteRows({
          data: { revisionId: this._revisionId, tableId: this._tableId, rowIds },
        })
      }
      return { ok: true }
    } catch {
      return { ok: false, error: 'Delete failed' }
    }
  }

  public async saveView(viewState: ViewState): Promise<{ ok: boolean; error?: string }> {
    try {
      const viewsData = await this._getOrCreateViewsData()

      const updatedView: ViewInput = {
        id: 'default',
        name: 'Default',
        ...(viewState.columns.length > 0 && {
          columns: viewState.columns.map((c) => ({ field: c.field, width: c.width, pinned: c.pinned })),
        }),
        ...(viewState.filters && { filters: JSON.parse(viewState.filters) }),
        ...(viewState.sorts.length > 0 && {
          sorts: viewState.sorts.map((s) => ({
            field: s.field,
            direction: s.direction === 'asc' ? SortOrder.Asc : SortOrder.Desc,
          })),
        }),
        ...(viewState.search && { search: viewState.search }),
      }

      const views = this._mergeDefaultView(viewsData.views, updatedView)

      await client.UpdateTableViews({
        data: {
          revisionId: this._revisionId,
          tableId: this._tableId,
          viewsData: {
            version: viewsData.version,
            defaultViewId: viewsData.defaultViewId,
            views,
          },
        },
      })

      this._cachedViewsData = null
      return { ok: true }
    } catch {
      return { ok: false, error: 'Save failed' }
    }
  }

  public async uploadFile(params: {
    rowId: string
    fileId: string
    file: File
  }): Promise<Record<string, unknown> | null> {
    const response = await this._fileService.add({
      revisionId: this._revisionId,
      tableId: this._tableId,
      rowId: params.rowId,
      fileId: params.fileId,
      file: params.file,
    })

    return response ? (response.row?.data as Record<string, unknown>) : null
  }

  private async _loadViewState(): Promise<ViewState | null> {
    const result = await client.GetTableViews({
      data: { revisionId: this._revisionId, tableId: this._tableId },
    })

    const views = result.table?.views
    if (!views) {
      return null
    }

    this._cachedViewsData = views

    const defaultView = views.views.find((v) => v.id === views.defaultViewId) ?? views.views[0]
    if (!defaultView) {
      return null
    }

    return {
      columns: (defaultView.columns ?? []).map((c) => ({
        field: c.field,
        width: c.width ?? undefined,
        pinned: (c.pinned as 'left' | 'right') ?? undefined,
      })),
      filters: defaultView.filters ? JSON.stringify(defaultView.filters) : null,
      sorts: (defaultView.sorts ?? []).map((s) => ({ field: s.field, direction: s.direction })),
      search: defaultView.search ?? '',
    }
  }

  private _buildWhereClause(filterWhere: Record<string, unknown> | null, search: string): object | undefined {
    const conditions: object[] = []

    if (search) {
      conditions.push({
        OR: [
          { id: { contains: search } },
          {
            data: {
              path: [],
              search,
              searchType: SearchType.Plain,
              searchIn: SearchIn.Values,
            },
          },
        ],
      })
    }

    if (filterWhere) {
      conditions.push(filterWhere)
    }

    if (conditions.length === 0) {
      return undefined
    }

    if (conditions.length === 1) {
      return conditions[0]
    }

    return { AND: conditions }
  }

  private _mapOrderBy(orderBy: Array<{ field: string; direction: string }>): OrderBy[] | undefined {
    if (orderBy.length === 0) {
      return undefined
    }

    return orderBy.map((o) => {
      const direction = o.direction === 'asc' ? SortOrder.Asc : SortOrder.Desc

      const systemField = RevisiumTableDataSource.SYSTEM_ORDER_FIELDS[o.field]
      if (systemField) {
        return { field: systemField, direction }
      }

      const path = o.field.startsWith('data.') ? o.field.slice(5) : o.field
      return {
        field: OrderByField.Data,
        path,
        direction,
        type: this._getOrderDataType(path),
      }
    })
  }

  private _getOrderDataType(fieldPath: string): OrderDataType {
    const prop = this._schema.properties?.[fieldPath]
    if (!prop) {
      return OrderDataType.Text
    }
    if ('type' in prop) {
      if (prop.type === 'number') {
        return OrderDataType.Float
      }
      if (prop.type === 'boolean') {
        return OrderDataType.Boolean
      }
    }
    return OrderDataType.Text
  }

  private async _getOrCreateViewsData(): Promise<ViewsData> {
    if (this._cachedViewsData) {
      return this._cachedViewsData
    }

    const result = await client.GetTableViews({
      data: { revisionId: this._revisionId, tableId: this._tableId },
    })

    if (result.table?.views) {
      this._cachedViewsData = result.table.views
      return result.table.views
    }

    return { version: 1, defaultViewId: 'default', views: [] }
  }

  private _mergeDefaultView(existingViews: ViewsData['views'], updatedView: ViewInput): ViewInput[] {
    const views: ViewInput[] = existingViews.map((v) => {
      if (v.id === updatedView.id) {
        return updatedView
      }
      return {
        id: v.id,
        name: v.name,
        ...(v.columns && { columns: v.columns.map((c) => ({ field: c.field, width: c.width })) }),
        ...(v.filters && { filters: v.filters }),
        ...(v.sorts && {
          sorts: v.sorts.map((s) => ({
            field: s.field,
            direction: s.direction === 'asc' ? SortOrder.Asc : SortOrder.Desc,
          })),
        }),
        ...(v.search && { search: v.search }),
      }
    })

    const hasDefault = views.some((v) => v.id === updatedView.id)
    if (!hasDefault) {
      views.push(updatedView)
    }

    return views
  }
}

container.register(
  RevisiumTableDataSource,
  () => {
    const projectContext = container.get(ProjectContext)
    const fileService = container.get(FileService)
    return new RevisiumTableDataSource(projectContext, fileService)
  },
  { scope: 'request' },
)
