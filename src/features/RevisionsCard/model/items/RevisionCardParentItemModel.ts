import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { IconType } from 'src/features/RevisionsCard/config/icons.ts'
import { IRevisionCardItem } from 'src/features/RevisionsCard/config/types.ts'
import { APP_ROUTE, BRANCH_ROUTE, ORGANIZATION_ROUTE, PROJECT_ROUTE } from 'src/shared/config/routes.ts'
import { IParentBranch } from 'src/shared/model/BackendStore'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class RevisionCardParentItemModel implements IRevisionCardItem {
  public index = 0

  constructor(
    private readonly projectPageModel: ProjectPageModel,
    private readonly parentBranch: IParentBranch,
  ) {
    makeAutoObservable(this)
  }

  public get id() {
    return this.parentBranch.branchName
  }

  public get children() {
    return []
  }

  public get disabled() {
    return false
  }

  public get icon() {
    return IconType.Parent
  }

  public get dataTestId() {
    return `revision-parent-branch-${this.parentBranch.branchName}`
  }

  public get link() {
    return generatePath(
      `/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}/-/${this.parentBranch.fromRevisionId}`,
      {
        organizationId: this.projectPageModel.organization.id,
        projectName: this.projectPageModel.project.name,
        branchName: this.parentBranch.branchName,
      },
    )
  }

  public get tooltip() {
    return [`Branch: ${this.parentBranch.branchName}`]
  }

  public get hidden() {
    return false
  }
}
