import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'

export const useCurrentDraftRevision = (): IRevisionModel | null => {
  return (useRouteLoaderData(RouteIds.DraftRevision) as IRevisionModel | undefined) || null
}
