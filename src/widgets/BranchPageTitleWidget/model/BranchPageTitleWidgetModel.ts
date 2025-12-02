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

    const tableId = this.projectPageModel.routeTableId

    if (!tableId) {
      return breadcrumbs
    }

    breadcrumbs.push({
      title: 'Database',
      href: this.linkMaker.currentBaseLink,
      isCurrentPage: false,
      dataTestId: `breadcrumb-branch-tables`,
    })

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

    if (!rowId) {
      const last = breadcrumbs.slice().pop()

      if (last) {
        last.isCurrentPage = true
      }
    }

    return breadcrumbs
  }

  public init() {}

  public dispose() {}
}
