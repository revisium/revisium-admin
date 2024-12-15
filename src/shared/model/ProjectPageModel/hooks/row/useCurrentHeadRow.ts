import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { IRowModel } from 'src/shared/model/BackendStore'

export const useCurrentHeadRow = (): IRowModel | null => {
  return (useRouteLoaderData(RouteIds.HeadRow) as IRowModel | undefined) || null
}
