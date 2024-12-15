import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { BRANCH_ROUTE, DRAFT_REVISION_ROUTE, ORGANIZATION_ROUTE, PROJECT_ROUTE } from 'src/shared/config/routes.ts'
import { IBranchModel } from 'src/shared/model/BackendStore'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

type Item = {
  id: string
  name: string
  link: string
  title: string
  isActive: boolean
  touched: boolean
}

export class MenuListModel {
  constructor(private readonly projectPageModel: ProjectPageModel) {
    makeAutoObservable(this)
  }

  public get hasNextPage() {
    return this.project.branchesConnection.availableNextPage
  }

  public get organizationId(): string {
    return this.organization.id
  }

  public get projectName(): string {
    return this.project.name
  }

  public get items(): Item[] {
    return this.project.branchesConnection.edges.map(({ node: branch }) => {
      const isActive = branch.name === this.branch?.name

      return {
        id: branch.id,
        name: branch.name,
        link: isActive
          ? ''
          : `${getBaseLink(this.organizationId, this.projectName, branch.name)}${getPostfixLink(branch)}`,
        title: `${branch.name}`,
        isActive,
        touched: branch.touched,
      }
    })
  }

  public init() {}

  public dispose() {}

  private get organization() {
    return this.projectPageModel.organization
  }

  private get project() {
    return this.projectPageModel.project
  }

  private get branch() {
    return this.projectPageModel.branch
  }
}

const getPostfixLink = (branch: IBranchModel): string => {
  if (branch.touched) {
    return generatePath(`/${DRAFT_REVISION_ROUTE}`)
  } else {
    return ''
  }
}

const getBaseLink = (organizationId: string, projectName: string, branchName: string): string => {
  return generatePath(`/${ORGANIZATION_ROUTE}/${PROJECT_ROUTE}/${BRANCH_ROUTE}`, {
    organizationId,
    projectName,
    branchName,
  })
}
