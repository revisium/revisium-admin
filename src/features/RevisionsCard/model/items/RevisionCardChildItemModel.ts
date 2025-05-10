import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { IconType } from 'src/features/RevisionsCard/config/icons.ts'
import { IRevisionCardItem } from 'src/features/RevisionsCard/config/types.ts'
import { APP_ROUTE, BRANCH_ROUTE, ORGANIZATION_ROUTE, PROJECT_ROUTE } from 'src/shared/config/routes.ts'
import { IRevisionModelChildBranch } from 'src/shared/model/BackendStore'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class RevisionCardChildItemModel implements IRevisionCardItem {
  public index = 0

  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly childBranch: IRevisionModelChildBranch,
  ) {
    makeAutoObservable(this)
  }

  public get id() {
    return this.childBranch.branchName
  }

  public get children() {
    return []
  }

  public get disabled() {
    return false
  }

  public get icon() {
    return IconType.Child
  }

  public get dataTestId() {
    return `revision-child-branch-${this.childBranch.branchName}`
  }

  public get link() {
    return generatePath(
      `/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}/-/${this.childBranch.revisionStartId}`,
      {
        organizationId: this.projectPageModel.organization.id,
        projectName: this.projectPageModel.project.name,
        branchName: this.childBranch.branchName,
      },
    )
  }

  public get tooltip() {
    return [`Branch: ${this.childBranch.branchName}`]
  }

  public get hidden() {
    return false
  }
}
