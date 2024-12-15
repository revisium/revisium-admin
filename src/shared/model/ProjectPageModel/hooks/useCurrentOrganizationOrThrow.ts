import { useRouteLoaderData } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'
import { IOrganizationModel } from 'src/shared/model/BackendStore/model/organization.mst.ts'

export const useCurrentOrganizationOrThrow = (): IOrganizationModel => {
  const organization = useRouteLoaderData(RouteIds.Organization) as IOrganizationModel | undefined

  if (!organization) {
    throw new Error('Not found organization from route loader')
  }

  return organization
}
