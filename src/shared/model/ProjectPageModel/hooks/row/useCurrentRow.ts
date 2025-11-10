import { useRouteLoaderData } from 'react-router-dom'
import { IRowModel } from 'src/shared/model/BackendStore'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useCurrentRow = (): IRowModel | null => {
  return useRouteLoaderData(RouteIds.Row) as IRowModel | null
}
