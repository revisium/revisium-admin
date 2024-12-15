import { LoaderFunction } from 'react-router-dom'
import { getProjectVariables } from 'src/app/lib/utils.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const projectLoader: LoaderFunction = async ({ params }) => {
  const projectVariables = getProjectVariables(params)

  const project =
    rootStore.cache.getProjectByVariables(projectVariables) || (await rootStore.backend.queryProject(projectVariables))

  if (!project.branchesConnection.countLoaded) {
    await rootStore.backend.queryBranches({
      ...projectVariables,
      first: 100,
    })
  }

  return project
}
