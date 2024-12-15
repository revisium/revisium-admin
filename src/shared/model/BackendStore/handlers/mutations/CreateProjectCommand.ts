import { createProjectMstRequest } from 'src/shared/model/BackendStore/api/createProjectMstRequest.ts'
import { ProjectMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/project.generated.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'
import { transformProjectFragment } from 'src/shared/model/BackendStore/utils/transformProjectFragment.ts'

export class CreateProjectCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly organizationId: string,
    private readonly projectName: string,
    private readonly branchName?: string,
    private readonly fromRevisionId?: string,
  ) {}

  private get projectVariables() {
    return {
      organizationId: this.organizationId,
      projectName: this.projectName,
      branchName: this.branchName,
      fromRevisionId: this.fromRevisionId,
    }
  }

  public async execute() {
    const project = await this.createProjectRequest()

    await this.refetchProjectsConnection()

    return project
  }

  private async createProjectRequest() {
    const { createProject: projectFragment } = await createProjectMstRequest({
      data: this.projectVariables,
    })

    return this.addProjectToCache(projectFragment)
  }

  private addProjectToCache(projectFragment: ProjectMstFragment) {
    const project = this.rootStore.cache.addProject(transformProjectFragment(projectFragment))
    this.rootStore.cache.addProjectByVariables(this.projectVariables, project.id)

    return project
  }

  private async refetchProjectsConnection() {
    await this.rootStore.backend.queryMeProjects({ first: 100 })
  }
}
