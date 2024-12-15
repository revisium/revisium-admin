import { makeAutoObservable } from 'mobx'
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
    return this.table.rowsConnection.edges.map(({ node }) => ({
      id: node.id,
      versionId: node.versionId,
      readonly: node.readonly,
      title: node.id,
      data: JSON.stringify(node.data, null, 2).replaceAll('\\n', ''),
      link: '',
    }))
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
