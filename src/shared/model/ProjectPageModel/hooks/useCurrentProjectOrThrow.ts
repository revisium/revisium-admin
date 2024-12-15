import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { IProjectModel } from 'src/shared/model/BackendStore'

export const useCurrentProjectOrThrow = (): IProjectModel => {
  const project = useRouteLoaderData(RouteIds.Project) as IProjectModel | undefined

  if (!project) {
    throw new Error('Not found project from route loader')
  }

  return project
}
