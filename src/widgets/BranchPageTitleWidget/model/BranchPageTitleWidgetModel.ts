import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { TABLE_ROUTE } from 'src/shared/config/routes.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

type BreadCrumb = {
  href: string
  title: string
  isCurrentPage: boolean
  dataTestId?: string
}

export class BranchPageTitleWidgetModel {
  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly linkMaker: LinkMaker,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get breadcrumbs(): BreadCrumb[] {
    const breadcrumbs: BreadCrumb[] = []

    breadcrumbs.push({
      title: this.branch.name,
      href: this.linkMaker.currentBaseLink,
      isCurrentPage: false,
      dataTestId: `breadcrumb-branch-${this.branch.name}`,
    })

    const tableId = this.projectPageModel.routeTableId

    if (tableId) {
      breadcrumbs.push({
        title: tableId,
        href: generatePath(`${this.linkMaker.currentBaseLink}/${TABLE_ROUTE}`, {
          tableId,
        }),
        isCurrentPage: false,
        dataTestId: `breadcrumb-table-${tableId}`,
      })
    }

    const rowId = this.projectPageModel.routeRowId
    if (rowId) {
      breadcrumbs.push({
        title: rowId,
        href: '',
        isCurrentPage: false,
        dataTestId: `breadcrumb-row-${rowId}`,
      })
    }

    const last = breadcrumbs.slice().pop()

    if (last) {
      last.isCurrentPage = true
    }

    return breadcrumbs
  }

  public get branchName() {
    return this.branch.name
  }

  public get title() {
    if (this.isDraftRevision) {
      return ''
    } else if (this.isHeadRevision) {
      return ''
    }

    return `[${this.revision.id.slice(0, 6)}]`
  }


  private get isDraftRevision() {
    return this.projectPageModel.isDraftRevision
  }

  private get isHeadRevision() {
    return this.projectPageModel.isHeadRevision
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }

  public init() {}

  public dispose() {}
}
