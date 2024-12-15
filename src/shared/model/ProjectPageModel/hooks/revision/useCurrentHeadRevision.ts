import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'

export const useCurrentHeadRevision = (): IRevisionModel | null => {
  return (useRouteLoaderData(RouteIds.HeadRevision) as IRevisionModel | undefined) || null
}
