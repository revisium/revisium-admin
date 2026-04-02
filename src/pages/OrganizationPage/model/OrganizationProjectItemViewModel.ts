import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { OrganizationProjectItemFragment } from 'src/__generated__/graphql-request.ts'
import {
  APP_ROUTE,
  BRANCH_ROUTE,
  DRAFT_TAG,
  ORGANIZATION_ROUTE,
  PROJECT_ROUTE,
  REVISION_ROUTE,
} from 'src/shared/config/routes.ts'

export class OrganizationProjectItemViewModel {
  constructor(private readonly project: OrganizationProjectItemFragment) {
    makeAutoObservable(this)
  }

  public get id(): string {
    return this.project.id
  }

  public get name(): string {
    return this.project.name
  }

  public get isPublic(): boolean {
    return this.project.isPublic
  }

  public get touched(): boolean {
    return this.project.rootBranch.touched
  }

  public get link(): string {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}/${REVISION_ROUTE}`, {
      organizationId: this.project.organizationId,
      projectName: this.project.name,
      branchName: this.project.rootBranch.name,
      revisionIdOrTag: DRAFT_TAG,
    })
  }
}
