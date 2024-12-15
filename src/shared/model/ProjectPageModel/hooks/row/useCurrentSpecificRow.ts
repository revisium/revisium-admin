import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { IRowModel } from 'src/shared/model/BackendStore'

export const useCurrentSpecificRow = (): IRowModel | null => {
  return (useRouteLoaderData(RouteIds.SpecificRow) as IRowModel | undefined) || null
}
