import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import {
  APP_ROUTE,
  BRANCH_ROUTE,
  DRAFT_REVISION_ROUTE,
  ORGANIZATION_ROUTE,
  PROJECT_API_KEYS_ROUTE,
  PROJECT_ROUTE,
  PROJECT_SETTINGS_ROUTE,
  PROJECT_USERS_ROUTE,
  ROW_ROUTE,
  SPECIFIC_REVISION_ROUTE,
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

  public get parentForTableOrRow() {
    const BASE_LINK = this.currentBaseLink

    const tableId = this.projectPageModel.routeTableId
    const rowId = this.projectPageModel.routeRowId

    if (tableId && rowId) {
      return generatePath(`${BASE_LINK}/${TABLE_ROUTE}`, {
        tableId,
      })
    }

    if (tableId) {
      return generatePath(`${BASE_LINK}`)
    }

    return undefined
  }

  public getCurrentOptions(): RevisionOptionType {
    if (this.projectPageModel.isDraftRevision) {
      return { isDraft: true }
    } else if (this.projectPageModel.isHeadRevision) {
      return { isHead: true }
    } else {
      return { id: this.revision.id }
    }
  }

  public makeProjectSettingsLink() {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${PROJECT_SETTINGS_ROUTE}`, {
      organizationId: this.organization.id,
      projectName: this.project.name,
    })
  }

  public makeProjectUsersLink() {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${PROJECT_USERS_ROUTE}`, {
      organizationId: this.organization.id,
      projectName: this.project.name,
    })
  }

  public makeProjectApiKeysLink() {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${PROJECT_API_KEYS_ROUTE}`, {
      organizationId: this.organization.id,
      projectName: this.project.name,
    })
  }

  public makeDefaultBranchLink() {
    // Navigate to the first available branch or main branch
    const defaultBranchName = 'main' // For now use 'main' as default
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}`, {
      organizationId: this.organization.id,
      projectName: this.project.name,
      branchName: defaultBranchName,
    })
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

export type RevisionOptionType = (
  | { isDraft: true; isHead?: false }
  | { isHead: true; isDraft?: false }
  | { id: string; isDraft?: false; isHead?: false }
) &
  TableAndRow

const getBaseLink = (
  organizationId: string,
  projectName: string,
  branchName: string,
  revision: RevisionOptionType,
): string => {
  if (revision.isHead) {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}`, {
      organizationId,
      projectName,
      branchName,
    })
  }

  if (revision.isDraft) {
    return generatePath(
      `/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}/${DRAFT_REVISION_ROUTE}`,
      {
        organizationId,
        projectName,
        branchName,
      },
    )
  }

  return generatePath(
    `/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}/${SPECIFIC_REVISION_ROUTE}`,
    {
      organizationId,
      projectName,
      branchName,
      revisionId: revision.id,
    },
  )
}
