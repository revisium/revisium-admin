import { useMatches } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useOrganizationNavigationState = () => {
  const matches = useMatches()

  const isProjectsActive = matches.some((match) => match.id === RouteIds.OrganizationOverview)
  const isMembersActive = matches.some((match) => match.id === RouteIds.OrganizationMembers)
  const isSettingsActive = matches.some((match) => match.id === RouteIds.OrganizationSettings)
  const isBillingActive = matches.some((match) => match.id === RouteIds.OrganizationBilling)

  return {
    isProjectsActive,
    isMembersActive,
    isSettingsActive,
    isBillingActive,
  }
}
