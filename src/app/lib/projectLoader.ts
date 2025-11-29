import { LoaderFunction } from 'react-router-dom'
import { getProjectVariables } from 'src/app/lib/utils.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container } from 'src/shared/lib'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const projectLoader: LoaderFunction = async ({ params }) => {
  const projectVariables = getProjectVariables(params)

  const project =
    rootStore.cache.getProjectByVariables(projectVariables) || (await rootStore.backend.queryProject(projectVariables))

  const context = container.get(ProjectContext)
  context.setProject(project)

  await context.loadProjectPermissions(projectVariables.organizationId, projectVariables.projectName)

  if (!project.branchesConnection.countLoaded) {
    await rootStore.backend.queryBranches({
      ...projectVariables,
      first: 100,
    })
  }

  return project
}
