import { deleteProjectMstRequest } from 'src/shared/model/BackendStore/api/deleteProjectMstRequest.ts'
import { IRootStore } from 'src/shared/model/BackendStore/types.ts'

export class DeleteProjectCommand {
  constructor(
    private readonly rootStore: IRootStore,
    private readonly organizationId: string,
    private readonly projectName: string,
  ) {}

  public async execute() {
    const result = await this.deleteProjectRequest()

    await this.updateProjectsConnection()

    return result
  }

  private async deleteProjectRequest() {
    const { deleteProject } = await deleteProjectMstRequest({
      data: { organizationId: this.organizationId, projectName: this.projectName },
    })

    return deleteProject
  }

  private async updateProjectsConnection() {
    const organization = this.rootStore.cache.organization.get(this.organizationId)
    const projectEdge = organization?.projectsConnection.edges.find((edge) => edge.node.name === this.projectName)
    organization?.projectsConnection.removeEdge(projectEdge?.cursor)
  }
}
