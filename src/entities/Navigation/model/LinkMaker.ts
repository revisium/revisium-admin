import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import {
  APP_ROUTE,
  BRANCH_ROUTE,
  CHANGES_ROUTE,
  ENDPOINTS_ROUTE,
  MIGRATIONS_ROUTE,
  ORGANIZATION_ROUTE,
  PROJECT_MCP_ROUTE,
  PROJECT_ROUTE,
  PROJECT_SETTINGS_ROUTE,
  PROJECT_USERS_ROUTE,
  REVISION_ROUTE,
  ROW_ROUTE,
  TABLE_ROUTE,
} from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { RouterService } from 'src/shared/model/RouterService.ts'

type CurrentSection = 'changes' | 'migrations' | undefined

export class LinkMaker {
  constructor(
    private projectContext: ProjectContext,
    private routerService: RouterService,
  ) {
    makeAutoObservable(this)
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

  private get organizationId(): string {
    return this.projectContext.organizationId
  }

  private get projectName(): string {
    return this.projectContext.projectName
  }

  private get branchName(): string {
    return this.projectContext.branchName
  }

  private get revisionIdOrTag(): string {
    return this.projectContext.revisionIdOrTag
  }

  public get isDataLoaded(): boolean {
    return this.organizationId !== '' && this.projectName !== '' && this.branchName !== ''
  }

  public get currentBaseLink(): string {
    if (!this.isDataLoaded) {
      return ''
    }
    return getBaseLink(this.organizationId, this.projectName, this.branchName, {
      revisionIdOrTag: this.revisionIdOrTag,
    })
  }

  public getCurrentOptions(): RevisionOptionType {
    return { revisionIdOrTag: this.revisionIdOrTag }
  }

  public makeProjectSettingsLink(): string {
    if (!this.organizationId || !this.projectName) {
      return ''
    }
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${PROJECT_SETTINGS_ROUTE}`, {
      organizationId: this.organizationId,
      projectName: this.projectName,
    })
  }

  public makeEndpointsLink(): string {
    if (!this.organizationId || !this.projectName) {
      return ''
    }
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${ENDPOINTS_ROUTE}`, {
      organizationId: this.organizationId,
      projectName: this.projectName,
    })
  }

  public makeProjectUsersLink(): string {
    if (!this.organizationId || !this.projectName) {
      return ''
    }
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${PROJECT_USERS_ROUTE}`, {
      organizationId: this.organizationId,
      projectName: this.projectName,
    })
  }

  public makeMcpLink(): string {
    if (!this.organizationId || !this.projectName) {
      return ''
    }
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${PROJECT_MCP_ROUTE}`, {
      organizationId: this.organizationId,
      projectName: this.projectName,
    })
  }

  public make(options: RevisionOptionType): string {
    if (!this.organizationId || !this.projectName || !this.branchName) {
      return ''
    }
    const { tableId, rowId } = options

    const BASE_LINK = getBaseLink(this.organizationId, this.projectName, this.branchName, options)

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
    if (!this.organizationId || !this.projectName || !this.branchName) {
      return ''
    }
    const baseLink = getBaseLink(this.organizationId, this.projectName, this.branchName, options)

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

container.register(LinkMaker, () => new LinkMaker(container.get(ProjectContext), container.get(RouterService)), {
  scope: 'singleton',
})
