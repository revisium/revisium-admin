import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'

export const useCurrentSpecificRevision = (): IRevisionModel | null => {
  return (useRouteLoaderData(RouteIds.SpecificRevision) as IRevisionModel | undefined) || null
}
