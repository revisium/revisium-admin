import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import {
  APP_ROUTE,
  BRANCH_ROUTE,
  ORGANIZATION_ROUTE,
  PROJECT_ROUTE,
  REVISION_ROUTE,
} from 'src/shared/config/routes.ts'
import { IProjectModel } from 'src/shared/model/BackendStore'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'

type Item = {
  id: string
  name: string
  organizationId: string
  touched: boolean
  link: string
}

export class MeProjectListModel {
  constructor(private readonly rootStore: IRootStore) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.init()
  }

  public get totalCount() {
    return this.meProjects.edges.length
  }

  public get hasNextPage() {
    return this.meProjects.availableNextPage
  }

  public get items(): Item[] {
    return this.meProjects.edges.map(({ node }) => ({
      id: node.id,
      name: node.name,
      organizationId: node.organization.id,
      touched: node.rootBranch.touched,
      link: createLink(node),
    }))
  }

  private get meProjects() {
    return this.rootStore.cache.meProjectsConnection
  }

  public tryToFetchNextPage() {
    if (this.hasNextPage) {
      void this.rootStore.backend.queryMeProjects({
        first: 100, // after: this.currentOrganization.projectsConnection.endCursor || undefined,
      })
    }
  }

  public init() {}

  public dispose() {}
}

const createLink = (project: IProjectModel): string => {
  return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}/${REVISION_ROUTE}`, {
    organizationId: project.organization.id,
    projectName: project.name,
    branchName: project.rootBranch.name,
    revisionIdOrTag: 'draft',
  })
}
