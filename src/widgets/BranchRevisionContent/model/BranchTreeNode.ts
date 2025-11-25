import { generatePath } from 'react-router-dom'
import { FindBranchFragment } from 'src/__generated__/graphql-request.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import {
  APP_ROUTE,
  BRANCH_ROUTE,
  DRAFT_TAG,
  ORGANIZATION_ROUTE,
  PROJECT_ROUTE,
  REVISION_ROUTE,
} from 'src/shared/config/routes.ts'
import { showNavigationToast } from 'src/widgets/BranchRevisionContent/lib/showNavigationToast.ts'

export class BranchTreeNode {
  constructor(
    private readonly branch: FindBranchFragment,
    public readonly depth: number,
    private readonly context: ProjectContext,
  ) {}

  public showNavigationToast = (): void => {
    if (this.isActive) return
    showNavigationToast({ path: `${this.name} / ${DRAFT_TAG}`, isReadonly: false })
  }

  public get id(): string {
    return this.branch.id
  }

  public get name(): string {
    return this.branch.name
  }

  public get isRoot(): boolean {
    return this.branch.isRoot
  }

  public get touched(): boolean {
    return this.branch.touched
  }

  public get isActive(): boolean {
    return this.branch.id === this.context.branch.id
  }

  public get link(): string {
    return generatePath(`/${APP_ROUTE}/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}/${REVISION_ROUTE}`, {
      organizationId: this.context.organization.id,
      projectName: this.context.project.name,
      branchName: this.branch.name,
      revisionIdOrTag: DRAFT_TAG,
    })
  }
}
