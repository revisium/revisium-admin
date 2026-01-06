import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { JsonObjectSchema, schemaRefsMapper } from 'src/entities/Schema'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore.ts'
import { createJsonValuePathByStore } from 'src/entities/Schema/lib/createJsonValuePathByStore.ts'
import { traverseValue } from 'src/entities/Schema/lib/traverseValue.ts'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { createEmptyJsonValueStore } from 'src/entities/Schema/model/value/createEmptyJsonValueStore.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { container } from 'src/shared/lib'
import { RowMutationDataSource } from 'src/widgets/RowStackWidget/model/RowMutationDataSource.ts'
import { MinimalTableData } from 'src/widgets/RowStackWidget/model/types.ts'

export enum RowStackModelStateType {
  List = 'List',
  CreatingRow = 'CreatingRow',
  ConnectingForeignKeyRow = 'ConnectingForeignKeyRow',
  UpdatingRow = 'UpdatingRow',
}

export type RowStackModelStateList = { type: RowStackModelStateType.List; isSelectingForeignKey: boolean }

export type RowStackModelStateCreatingTable = {
  type: RowStackModelStateType.CreatingRow
  isSelectingForeignKey: boolean
  store: RowDataCardStore
}

export type RowStackModelStateConnectingForeignKeyTable = {
  type: RowStackModelStateType.ConnectingForeignKeyRow
  previousType: RowStackModelStateType.CreatingRow | RowStackModelStateType.UpdatingRow
  isSelectingForeignKey: boolean
  store: RowDataCardStore
  foreignKeyNode: JsonStringValueStore
  isCreating?: boolean
}

export type RowStackModelStateUpdatingTable = {
  type: RowStackModelStateType.UpdatingRow
  isSelectingForeignKey: boolean
  store: RowDataCardStore
}

export type RowStackModelState =
  | RowStackModelStateList
  | RowStackModelStateCreatingTable
  | RowStackModelStateConnectingForeignKeyTable
  | RowStackModelStateUpdatingTable

export interface CreatedRowResult {
  id: string
}

export class RowStackModel {
  public readonly id = nanoid()

  private readonly mutationDataSource: RowMutationDataSource

  constructor(
    private readonly projectContext: ProjectContext,
    private readonly customTable: MinimalTableData | null,
    public state: RowStackModelState,
  ) {
    this.mutationDataSource = container.get(RowMutationDataSource)
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get table(): MinimalTableData {
    if (!this.customTable) {
      throw new Error('RowStackModel: table is not provided')
    }
    return this.customTable
  }

  public get schema(): JsonObjectSchema {
    return this.table.schema as JsonObjectSchema
  }

  public get isEditableRevision() {
    return this.projectContext.isDraftRevision
  }

  public get revisionId(): string {
    return this.projectContext.revision.id
  }

  public get currentForeignKeyPath() {
    if (this.state.type === RowStackModelStateType.ConnectingForeignKeyRow) {
      return createJsonValuePathByStore(this.state.foreignKeyNode)
    }
    return ''
  }

  private get branch() {
    return this.projectContext.branch
  }

  public async createRow(rowId: string, data: JsonValue): Promise<CreatedRowResult | null> {
    try {
      const result = await this.mutationDataSource.createRow({
        revisionId: this.branch.draft.id,
        tableId: this.table.id,
        rowId,
        data,
      })

      if (result) {
        if (!this.branch.touched) {
          this.projectContext.updateTouched(true)
        }
        return { id: result.row.id }
      }

      return null
    } catch (e) {
      console.error(e)
      return null
    }
  }

  public async updateRow(store: RowDataCardStore): Promise<boolean> {
    try {
      const originalRowId = store.name.baseValue
      const currentRowId = store.name.value
      const data = store.root.getPlainValue()

      const needRename = originalRowId !== currentRowId

      if (needRename) {
        const renameResult = await this.mutationDataSource.renameRow({
          revisionId: this.branch.draft.id,
          tableId: this.table.id,
          rowId: originalRowId,
          nextRowId: currentRowId,
        })

        if (!renameResult) {
          return false
        }
      }

      if (store.root.touched) {
        const updateResult = await this.mutationDataSource.updateRow({
          revisionId: this.branch.draft.id,
          tableId: this.table.id,
          rowId: currentRowId,
          data,
        })

        if (!updateResult) {
          return false
        }
      }

      if (!this.branch.touched) {
        this.projectContext.updateTouched(true)
      }
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  public async uploadFile(store: RowDataCardStore, fileId: string, file: File): Promise<JsonValue | null> {
    try {
      const result = await this.mutationDataSource.uploadFile({
        revisionId: this.branch.draft.id,
        tableId: this.table.id,
        rowId: store.name.getPlainValue(),
        fileId,
        file,
      })

      if (result) {
        if (!this.branch.touched) {
          this.projectContext.updateTouched(true)
        }
        return result.row.data as JsonValue
      }

      return null
    } catch (e) {
      console.error(e)
      return null
    }
  }

  public toList() {
    this.state = {
      type: RowStackModelStateType.List,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
    }
  }

  public toConnectingForeignKeyRow(foreignKeyNode: JsonStringValueStore, isCreating?: boolean) {
    if (
      this.state.type === RowStackModelStateType.CreatingRow ||
      this.state.type === RowStackModelStateType.UpdatingRow
    ) {
      this.state = {
        type: RowStackModelStateType.ConnectingForeignKeyRow,
        previousType: this.state.type,
        isSelectingForeignKey: this.state.isSelectingForeignKey,
        store: this.state.store,
        foreignKeyNode,
        isCreating,
      }
    } else {
      throw new Error('Invalid state')
    }
  }

  public toCloneRowFromData(rowData: JsonValue) {
    const rowId = `${this.table.id.toLowerCase()}-${nanoid(9).toLowerCase()}`

    const schemaStore = createJsonSchemaStore(this.schema)
    const store = new RowDataCardStore(schemaStore, createEmptyJsonValueStore(schemaStore), rowId, null, 0)
    store.root.updateBaseValue(rowData)

    traverseValue(store.root, (item) => {
      if (item.$ref) {
        const refSchema = schemaRefsMapper[item.$ref]

        if (refSchema) {
          const valueStore = createEmptyJsonValueStore(createJsonSchemaStore(refSchema))
          item.updateBaseValue(valueStore.getPlainValue())
        }
      }
    })

    this.state = {
      type: RowStackModelStateType.CreatingRow,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
      store,
    }
  }

  public toCreatingRow() {
    const rowId = `${this.table.id.toLowerCase()}-${nanoid(9).toLowerCase()}`

    const schemaStore = createJsonSchemaStore(this.schema)
    const store =
      this.state.type === RowStackModelStateType.ConnectingForeignKeyRow
        ? this.state.store
        : new RowDataCardStore(schemaStore, createEmptyJsonValueStore(schemaStore), rowId)

    this.state = {
      type: RowStackModelStateType.CreatingRow,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
      store,
    }
  }

  public toUpdatingTableFromConnectingForeignKeyRow() {
    if (this.state.type !== RowStackModelStateType.ConnectingForeignKeyRow) {
      throw new Error('Invalid state')
    }

    const store = this.state.store

    this.state = {
      type: RowStackModelStateType.UpdatingRow,
      isSelectingForeignKey: this.state.isSelectingForeignKey,
      store,
    }
  }

  public init() {}

  public dispose() {
    this.mutationDataSource.dispose()
  }

  public updateStore(store: RowDataCardStore) {
    if (this.state.type === RowStackModelStateType.UpdatingRow) {
      this.state.store = store
    }
  }
}
