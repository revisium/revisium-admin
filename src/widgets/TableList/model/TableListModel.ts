import { makeAutoObservable } from 'mobx'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { DeleteTableCommand } from 'src/shared/model/BackendStore/handlers/mutations/DeleteTableCommand.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { TableListItemType } from 'src/widgets/TableList/config/types.ts'

export class TableListModel {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly projectPageModel: ProjectPageModel,
    private readonly permissionContext: PermissionContext,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.init()
  }

  public get totalCount() {
    return this.items.length
  }

  public get hasNextPage() {
    return this.revision.tablesConnection.availableNextPage
  }

  public get isEditableRevision() {
    return this.projectPageModel.isEditableRevision
  }

  public get canCreateTable(): boolean {
    return this.isEditableRevision && this.permissionContext.canCreateTable
  }

  public get canUpdateTable(): boolean {
    return this.isEditableRevision && this.permissionContext.canUpdateTable
  }

  public get canDeleteTable(): boolean {
    return this.isEditableRevision && this.permissionContext.canDeleteTable
  }

  public get showMenu(): boolean {
    return this.canUpdateTable || this.canCreateTable || this.canDeleteTable
  }

  public get items(): TableListItemType[] {
    return this.revision.tablesConnection.edges.map(({ node }) => ({
      id: node.id,
      versionId: node.versionId,
      readonly: node.readonly,
      title: node.id,
      count: node.count,
      link: '',
    }))
  }

  public dispose() {}

  public tryToFetchNextPage() {
    if (this.hasNextPage) {
      void this.rootStore.queryTables({
        revisionId: this.revision.id,
        first: 50,
        after: this.revision.tablesConnection.endCursor || undefined,
      })
    }
  }

  public async deleteTable(tableId: string) {
    try {
      const command = new DeleteTableCommand(this.projectPageModel, tableId)
      return await command.execute()
    } catch (e) {
      console.log(e)
      return false
    }
  }

  public init() {}

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }
}
