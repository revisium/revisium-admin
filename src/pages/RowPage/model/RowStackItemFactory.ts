import { nanoid } from 'nanoid'
import {
  type RowEditorCallbacks,
  type ForeignKeySearchResult,
  type JsonSchema as ToolkitJsonSchema,
} from '@revisium/schema-toolkit-ui'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonObjectSchema, schemaRefsMapper } from 'src/entities/Schema'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { RowListRefreshService } from 'src/widgets/RowList/model/RowListRefreshService.ts'
import { ForeignSchemaCache } from './ForeignSchemaCache.ts'
import { RowEditorState } from './RowEditorState.ts'
import { RowListItem, RowCreatingItem, RowUpdatingItem } from './items'
import { RowData, RowEditorNavigation, RowEditorNotifications } from '../config/types.ts'

export interface RowStackItemFactoryDeps {
  projectContext: ProjectContext
  projectPermissions: ProjectPermissions
  mutationDataSource: RowMutationDataSource
  rowListRefreshService: RowListRefreshService
  schemaCache: ForeignSchemaCache
  notifications: RowEditorNotifications
  navigation: RowEditorNavigation
  searchForeignKey: (tableId: string, search: string) => Promise<ForeignKeySearchResult>
  requestForeignKeySelection: (
    item: RowCreatingItem | RowUpdatingItem,
    foreignTableId: string,
  ) => Promise<string | null>
  requestForeignKeyCreation: (item: RowCreatingItem | RowUpdatingItem, foreignTableId: string) => Promise<string | null>
}

interface ItemRef {
  item: RowCreatingItem | RowUpdatingItem | null
}

export class RowStackItemFactory {
  constructor(private readonly deps: RowStackItemFactoryDeps) {}

  public createInitialItem(tableId: string, rowData?: RowData): RowListItem | RowUpdatingItem {
    if (!rowData) {
      return this.createListItem(tableId, false)
    }
    const schema = this.deps.schemaCache.getOrThrow(tableId)
    return this.createUpdatingItem(tableId, schema, rowData.rowId, rowData.data, rowData.foreignKeysCount, false)
  }

  public createListItem(tableId: string, isSelectingForeignKey: boolean): RowListItem {
    return new RowListItem(
      {
        projectContext: this.deps.projectContext,
        projectPermissions: this.deps.projectPermissions,
        tableId,
        schema: this.deps.schemaCache.get(tableId),
      },
      isSelectingForeignKey,
    )
  }

  public createCreatingItem(
    tableId: string,
    schema: JsonObjectSchema,
    isSelectingForeignKey: boolean,
  ): RowCreatingItem {
    const rowId = this.generateRowId(tableId)
    const itemRef: ItemRef = { item: null }
    const callbacks = this.createCallbacks(itemRef, false)
    const state = new RowEditorState({
      schema: schema as ToolkitJsonSchema,
      mode: 'creating',
      rowId,
      refSchemas: schemaRefsMapper as Record<string, ToolkitJsonSchema>,
      callbacks,
    })
    const item = new RowCreatingItem(this.createEditorDeps(tableId), isSelectingForeignKey, state)
    itemRef.item = item
    return item
  }

  public createCreatingItemFromClone(
    tableId: string,
    schema: JsonObjectSchema,
    data: JsonValue,
    isSelectingForeignKey: boolean,
  ): RowCreatingItem {
    const rowId = this.generateRowId(tableId)
    const itemRef: ItemRef = { item: null }
    const callbacks = this.createCallbacks(itemRef, false)
    const state = new RowEditorState({
      schema,
      initialValue: data,
      mode: 'creating',
      rowId,
      refSchemas: schemaRefsMapper as Record<string, ToolkitJsonSchema>,
      callbacks,
    })
    const item = new RowCreatingItem(this.createEditorDeps(tableId), isSelectingForeignKey, state)
    itemRef.item = item
    return item
  }

  public createUpdatingItem(
    tableId: string,
    schema: JsonObjectSchema,
    rowId: string,
    data: JsonValue,
    foreignKeysCount: number,
    isSelectingForeignKey: boolean,
  ): RowUpdatingItem {
    const itemRef: ItemRef = { item: null }
    const callbacks = this.createCallbacks(itemRef, true)
    const state = new RowEditorState({
      schema: schema as ToolkitJsonSchema,
      initialValue: data,
      mode: 'editing',
      rowId,
      refSchemas: schemaRefsMapper as Record<string, ToolkitJsonSchema>,
      callbacks,
      foreignKeysCount,
    })
    const item = new RowUpdatingItem(this.createEditorDeps(tableId), isSelectingForeignKey, state, rowId)
    itemRef.item = item
    return item
  }

  public createUpdatingItemWithState(
    tableId: string,
    state: RowEditorState,
    rowId: string,
    isSelectingForeignKey: boolean,
  ): RowUpdatingItem {
    return new RowUpdatingItem(this.createEditorDeps(tableId), isSelectingForeignKey, state, rowId)
  }

  private createEditorDeps(tableId: string) {
    return {
      projectContext: this.deps.projectContext,
      projectPermissions: this.deps.projectPermissions,
      tableId,
      schema: this.deps.schemaCache.get(tableId),
      mutationDataSource: this.deps.mutationDataSource,
      rowListRefreshService: this.deps.rowListRefreshService,
      notifications: this.deps.notifications,
      navigation: this.deps.navigation,
    }
  }

  private createCallbacks(itemRef: ItemRef, withUpload: boolean): RowEditorCallbacks {
    const callbacks: RowEditorCallbacks = {
      onSearchForeignKey: (tableId: string, search: string) => {
        return this.deps.searchForeignKey(tableId, search)
      },
      onOpenTableSearch: (tableId: string) => {
        if (!itemRef.item) {
          return Promise.resolve(null)
        }
        return this.deps.requestForeignKeySelection(itemRef.item, tableId)
      },
      onCreateAndConnect: (tableId: string) => {
        if (!itemRef.item) {
          return Promise.resolve(null)
        }
        return this.deps.requestForeignKeyCreation(itemRef.item, tableId)
      },
      onNavigateToForeignKey: (tableId: string, rowId: string) => {
        this.deps.navigation.navigateToRow(tableId, rowId)
      },
    }

    if (withUpload) {
      callbacks.onUploadFile = async (fileId: string, file: File) => {
        const updatingItem = itemRef.item as RowUpdatingItem | null
        if (updatingItem) {
          return updatingItem.uploadFileWithNotification(fileId, file)
        }
        return null
      }
    }

    return callbacks
  }

  private generateRowId(tableId: string): string {
    return `${tableId.toLowerCase()}-${nanoid(9).toLowerCase()}`
  }
}
