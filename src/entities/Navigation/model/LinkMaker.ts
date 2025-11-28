import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import {
  APP_ROUTE,
  BRANCH_ROUTE,
  CHANGES_ROUTE,
  DRAFT_TAG,
  ENDPOINTS_ROUTE,
  HEAD_TAG,
  MIGRATIONS_ROUTE,
  ORGANIZATION_ROUTE,
  PROJECT_ROUTE,
  PROJECT_SETTINGS_ROUTE,
  REVISION_ROUTE,
  ROW_ROUTE,
  TABLE_ROUTE,
} from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { RouterService } from 'src/shared/model/RouterService.ts'

type CurrentSection = 'changes' | 'migrations' | undefined

export class LinkMaker {
  constructor(private context: ProjectContext) {
    makeAutoObservable(this)
  }

  private get routerService(): RouterService {
    return container.get(RouterService)
  }

  private get currentPathname(): string {
    return this.routerService.router.state.location.pathname
  }

  public get currentSection(): CurrentSection {
    const path = this.currentPathname
    if (path.includes(CHANGES_ROUTE)) {
      return 'changes'
    }
    if (path.includes(MIGRATIONS_ROUTE)) {
      return 'migrations'
    }
    return undefined
  }

  private get organization() {
    return this.context.project.organization
  }

  private get project() {
    return this.context.project
  }

  private get branch() {
    return this.context.branch
  }

  private get revision() {
    return this.context.revision
  }

  public get currentBaseLink() {
    return getBaseLink(this.organization.id, this.project.name, this.branch.name, this.getCurrentOptions())
  }

  public getCurrentOptions(): RevisionOptionType {
    if (this.revision.id === this.branch.draft.id) {
      return { revisionIdOrTag: DRAFT_TAG }
    } else if (this.revision.id === this.branch.head.id) {
      return { revisionIdOrTag: HEAD_TAG }
    } else {
      return { revisionIdOrTag: this.revision.id }
    }
  }

  public makeProjectSettingsLink() {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${PROJECT_SETTINGS_ROUTE}`, {
      organizationId: this.organization.id,
      projectName: this.project.name,
    })
  }

  public makeEndpointsLink() {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${ENDPOINTS_ROUTE}`, {
      organizationId: this.organization.id,
      projectName: this.project.name,
    })
  }

  public make(options: RevisionOptionType) {
    const tableId = options.tableId || this.context.table?.id
    const rowId = options.rowId || this.context.row?.id

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

  public makeRevisionLink(options: { revisionIdOrTag: string }): string {
    const baseLink = getBaseLink(this.organization.id, this.project.name, this.branch.name, options)

    if (this.currentSection === 'changes') {
      return `${baseLink}/${CHANGES_ROUTE}`
    }

    if (this.currentSection === 'migrations') {
      return `${baseLink}/${MIGRATIONS_ROUTE}`
    }

    return baseLink
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
