import { LoaderFunction } from 'react-router-dom'
import { getOrganizationVariables } from 'src/app/lib/utils.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

export const organizationLoader: LoaderFunction = async ({ params }) => {
  const { organizationId } = getOrganizationVariables(params)

  const organization =
    rootStore.cache.getOrganization(organizationId) || rootStore.cache.addOrganization({ id: organizationId })

  return organization
}
