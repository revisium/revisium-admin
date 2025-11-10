import { useRouteLoaderData } from 'react-router-dom'
import { IRevisionModel } from 'src/shared/model/BackendStore'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useCurrentRevision = (): IRevisionModel | null => {
  return useRouteLoaderData(RouteIds.Revision) as IRevisionModel | null
}
