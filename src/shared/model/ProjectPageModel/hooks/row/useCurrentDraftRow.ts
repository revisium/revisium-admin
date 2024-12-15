import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { IRowModel } from 'src/shared/model/BackendStore'

export const useCurrentDraftRow = (): IRowModel | null => {
  return (useRouteLoaderData(RouteIds.DraftRow) as IRowModel | undefined) || null
}
