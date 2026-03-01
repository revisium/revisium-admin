import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { TABLE_ROUTE } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'

export type BreadCrumb = {
  href: string
  title: string
  isCurrentPage: boolean
  dataTestId?: string
}

export class BranchPageTitleWidgetModel implements IViewModel {
  private _tableId: string | undefined = undefined
  private _rowId: string | undefined = undefined

  constructor(private readonly linkMaker: LinkMaker) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get breadcrumbs(): BreadCrumb[] {
    const result: BreadCrumb[] = []

    result.push({
      title: 'Database',
      href: this.linkMaker.currentBaseLink,
      isCurrentPage: !this._tableId,
      dataTestId: 'breadcrumb-branch-tables',
    })

    if (!this._tableId) {
      return result
    }

    result.push({
      title: this._tableId,
      href: generatePath(`${this.linkMaker.currentBaseLink}/${TABLE_ROUTE}`, {
        tableId: this._tableId,
      }),
      isCurrentPage: !this._rowId,
      dataTestId: `breadcrumb-table-${this._tableId}`,
    })

    return result
  }

  public init(tableId: string | undefined, rowId: string | undefined): void {
    this._tableId = tableId
    this._rowId = rowId
  }

  public dispose(): void {}
}

container.register(BranchPageTitleWidgetModel, () => new BranchPageTitleWidgetModel(container.get(LinkMaker)), {
  scope: 'request',
})
