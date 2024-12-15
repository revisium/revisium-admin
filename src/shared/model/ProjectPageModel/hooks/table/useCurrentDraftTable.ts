import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { ITableModel } from 'src/shared/model/BackendStore'

export const useCurrentDraftTable = (): ITableModel | null => {
  return (useRouteLoaderData(RouteIds.DraftTable) as ITableModel | undefined) || null
}
