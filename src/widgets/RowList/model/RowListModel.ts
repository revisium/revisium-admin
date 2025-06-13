import { makeAutoObservable } from 'mobx'
import { JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore.ts'
import { traverseStoreWithSkipping } from 'src/entities/Schema/lib/traverseStore.ts'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'
import { createJsonValueStore } from 'src/entities/Schema/model/value/createJsonValueStore.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { ITableModel } from 'src/shared/model/BackendStore'
import { DeleteRowCommand } from 'src/shared/model/BackendStore/handlers/mutations/DeleteRowCommand.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export type RowListItemType = {
  id: string
  versionId: string
  readonly: boolean
  title: string
  data: string
  link: string
  cells: JsonValueStore[]
}

export class RowListModel {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
    private table: ITableModel,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get totalCount() {
    return this.items.length
  }

  public get hasNextPage() {
    return this.table.rowsConnection.availableNextPage
  }

  public get isEdit() {
    return this.projectPageModel.isEditableRevision
  }

  public get items(): RowListItemType[] {
    const schemaStore = createJsonSchemaStore(this.table.schema as JsonSchema)

    const list: JsonSchemaStore[] = []

    traverseStoreWithSkipping(schemaStore, (node) => {
      if (
        node.type === JsonSchemaTypeName.String ||
        node.type === JsonSchemaTypeName.Number ||
        node.type === JsonSchemaTypeName.Boolean
      ) {
        list.push(node)
      } else if (node.type === JsonSchemaTypeName.Object) {
        if (node.$ref) {
          list.push(node)
          return true
        }
      } else {
        return true
      }
    })

    return this.table.rowsConnection.edges.map(({ node }) => {
      createJsonValueStore(schemaStore, node.id, node.data)

      return {
        id: node.id,
        versionId: node.versionId,
        readonly: node.readonly,
        title: node.id,
        data: JSON.stringify(node.data, null, 2).replaceAll('\\n', '').substring(0, 10),
        link: '',
        cells: list.map((item) => item.getValue(node.id)).filter((value): value is JsonValueStore => Boolean(value)),
      }
    })
  }

  public setTable(table: ITableModel) {
    this.table = table
  }

  public dispose() {}

  public tryToFetchNextPage() {
    if (this.hasNextPage) {
      void this.rootStore.queryRows({
        revisionId: this.revision.id,
        tableId: this.table.id,
        first: 50,
        after: this.table.rowsConnection.endCursor || undefined,
      })
    }
  }

  public async deleteRow(rowId: string) {
    try {
      const command = new DeleteRowCommand(this.rootStore, this.projectPageModel)
      return await command.execute(rowId)
    } catch (e) {
      console.error(e)

      return false
    }
  }

  public init() {}

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }
}
