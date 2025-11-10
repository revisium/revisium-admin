import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import {
  APP_ROUTE,
  BRANCH_ROUTE,
  DRAFT_TAG,
  HEAD_TAG,
  ORGANIZATION_ROUTE,
  PROJECT_ROUTE,
  REVISION_ROUTE,
  ROW_ROUTE,
  TABLE_ROUTE,
} from 'src/shared/config/routes.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class LinkMaker {
  constructor(private projectPageModel: ProjectPageModel) {
    makeAutoObservable(this)
  }

  private get organization() {
    return this.projectPageModel.organization
  }

  private get project() {
    return this.projectPageModel.project
  }

  private get branch() {
    return this.projectPageModel.branchOrThrow
  }

  private get revision() {
    return this.projectPageModel.revisionOrThrow
  }

  public get currentBaseLink() {
    return getBaseLink(this.organization.id, this.project.name, this.branch.name, this.getCurrentOptions())
  }

  public getCurrentOptions(): RevisionOptionType {
    if (this.projectPageModel.isDraftRevision) {
      return { revisionIdOrTag: DRAFT_TAG }
    } else if (this.projectPageModel.isHeadRevision) {
      return { revisionIdOrTag: HEAD_TAG }
    } else {
      return { revisionIdOrTag: this.revision.id }
    }
  }

  public make(options: RevisionOptionType) {
    const tableId = options.tableId || this.projectPageModel.routeTableId
    const rowId = options.rowId || this.projectPageModel.routeRowId

    const BASE_LINK = getBaseLink(this.organization.id, this.project.name, this.branch.name, options)

    if (tableId && rowId) {
      return generatePath(`${BASE_LINK}/${TABLE_ROUTE}/${ROW_ROUTE}`, {
        tableId,
        rowId,
      })
    }

    if (tableId) {
      return generatePath(`${BASE_LINK}/${TABLE_ROUTE}`, { tableId })
    }

    return BASE_LINK
  }

  init() {}

  dispose() {}
}

type TableAndRow = { tableId?: string; rowId?: string }

export type RevisionOptionType = {
  revisionIdOrTag: string
} & TableAndRow

const getBaseLink = (
  organizationId: string,
  projectName: string,
  branchName: string,
  revision: RevisionOptionType,
): string => {
  return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}/${REVISION_ROUTE}`, {
    organizationId,
    projectName,
    branchName,
    revisionIdOrTag: revision.revisionIdOrTag,
  })
}
