import { makeAutoObservable } from 'mobx'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

type Item = {
  id: string
  versionId: string
  link: string
  isActive: boolean
  touched: boolean
}

export class TableMenuListModel {
  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly linkMaker: LinkMaker,
  ) {
    makeAutoObservable(this)
  }

  public get hasNextPage() {
    return this.project.branchesConnection.availableNextPage
  }

  public get items(): Item[] {
    return this.revision.tablesConnection.edges.map(({ node: table }) => {
      const isActive = table.id === this.table?.id

      return {
        id: table.id,
        versionId: table.versionId,
        link: isActive ? '' : `${this.linkMaker.currentBaseLink}/${table.id}`,
        isActive,
        touched: !table.readonly,
      }
    })
  }

  private get project() {
    return this.projectPageModel.project
  }

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }

  private get table() {
    return this.projectPageModel.table
  }

  public init() {}

  public dispose() {}
}
