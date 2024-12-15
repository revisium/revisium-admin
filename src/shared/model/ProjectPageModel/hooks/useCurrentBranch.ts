import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { IBranchModel } from 'src/shared/model/BackendStore'

export const useCurrentBranch = (): IBranchModel | null => {
  return (useRouteLoaderData(RouteIds.Branch) as IBranchModel | undefined) || null
}
