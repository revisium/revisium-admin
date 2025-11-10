import { useRouteLoaderData } from 'react-router-dom'
import { ITableModel } from 'src/shared/model/BackendStore'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useCurrentTable = (): ITableModel | null => {
  return useRouteLoaderData(RouteIds.Table) as ITableModel | null
}
