import { LoaderFunction } from 'react-router-dom'
import { getProjectVariables } from 'src/app/lib/utils.ts'
import { ProjectDataSource } from 'src/entities/Project'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'

export const projectLoader: LoaderFunction = async ({ params }) => {
  const projectVariables = getProjectVariables(params)
  const projectDataSource = container.get(ProjectDataSource)
  const context = container.get(ProjectContext)

  const project = await projectDataSource.getProject(projectVariables.organizationId, projectVariables.projectName)

  context.setProject(project)
  await context.loadProjectPermissions(projectVariables.organizationId, projectVariables.projectName)

  return project
}
