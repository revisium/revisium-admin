import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { ITableModel } from 'src/shared/model/BackendStore'

export const useCurrentSpecificTable = (): ITableModel | null => {
  return (useRouteLoaderData(RouteIds.SpecificTable) as ITableModel | undefined) || null
}
