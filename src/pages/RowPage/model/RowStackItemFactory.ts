import { PermissionContext } from 'src/shared/model/AbilityService'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonObjectSchema } from 'src/entities/Schema'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { RowListRefreshService } from 'src/widgets/RowList/model/RowListRefreshService.ts'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { RowDataCardStoreFactory } from './RowDataCardStoreFactory.ts'
import { ForeignSchemaCache } from './ForeignSchemaCache.ts'
import { RowListItem, RowCreatingItem, RowUpdatingItem } from './items'
import { RowData, RowEditorNavigation, RowEditorNotifications } from '../config/types.ts'

export interface RowStackItemFactoryDeps {
  projectContext: ProjectContext
  permissionContext: PermissionContext
  mutationDataSource: RowMutationDataSource
  rowListRefreshService: RowListRefreshService
  storeFactory: RowDataCardStoreFactory
  schemaCache: ForeignSchemaCache
  notifications: RowEditorNotifications
  navigation: RowEditorNavigation
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
        permissionContext: this.deps.permissionContext,
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
    const store = this.deps.storeFactory.createEmpty(schema, tableId)
    return this.createCreatingItemWithStore(tableId, store, isSelectingForeignKey)
  }

  public createCreatingItemFromClone(
    tableId: string,
    schema: JsonObjectSchema,
    data: JsonValue,
    isSelectingForeignKey: boolean,
  ): RowCreatingItem {
    const store = this.deps.storeFactory.createFromClone(schema, tableId, data)
    return this.createCreatingItemWithStore(tableId, store, isSelectingForeignKey)
  }

  public createCreatingItemWithStore(
    tableId: string,
    store: RowDataCardStore,
    isSelectingForeignKey: boolean,
  ): RowCreatingItem {
    return new RowCreatingItem(
      {
        projectContext: this.deps.projectContext,
        permissionContext: this.deps.permissionContext,
        tableId,
        schema: this.deps.schemaCache.get(tableId),
        mutationDataSource: this.deps.mutationDataSource,
        rowListRefreshService: this.deps.rowListRefreshService,
        notifications: this.deps.notifications,
        navigation: this.deps.navigation,
      },
      isSelectingForeignKey,
      store,
    )
  }

  public createUpdatingItem(
    tableId: string,
    schema: JsonObjectSchema,
    rowId: string,
    data: JsonValue,
    foreignKeysCount: number,
    isSelectingForeignKey: boolean,
  ): RowUpdatingItem {
    const store = this.deps.storeFactory.createForUpdating(schema, rowId, data, foreignKeysCount)
    return this.createUpdatingItemWithStore(tableId, store, rowId, isSelectingForeignKey)
  }

  public createUpdatingItemWithStore(
    tableId: string,
    store: RowDataCardStore,
    rowId: string,
    isSelectingForeignKey: boolean,
  ): RowUpdatingItem {
    return new RowUpdatingItem(
      {
        projectContext: this.deps.projectContext,
        permissionContext: this.deps.permissionContext,
        tableId,
        schema: this.deps.schemaCache.get(tableId),
        mutationDataSource: this.deps.mutationDataSource,
        rowListRefreshService: this.deps.rowListRefreshService,
        notifications: this.deps.notifications,
        navigation: this.deps.navigation,
      },
      isSelectingForeignKey,
      store,
      rowId,
    )
  }
}
