import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { ITableModel } from 'src/shared/model/BackendStore'

export const useCurrentHeadTable = (): ITableModel | null => {
  return (useRouteLoaderData(RouteIds.HeadTable) as ITableModel | undefined) || null
}
