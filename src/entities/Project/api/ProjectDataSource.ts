import { GetProjectForLoaderQuery, ProjectLoaderFragmentFragment } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'

export type ProjectLoaderData = ProjectLoaderFragmentFragment

export class ProjectDataSource {
  public async getProject(organizationId: string, projectName: string): Promise<ProjectLoaderData> {
    const result: GetProjectForLoaderQuery = await client.getProjectForLoader({
      data: { organizationId, projectName },
    })

    return result.project
  }
}

container.register(ProjectDataSource, () => new ProjectDataSource(), { scope: 'singleton' })
