import { useMatches } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useOrganizationNavigationState = () => {
  const matches = useMatches()

  const isProjectsActive = matches.some((match) => match.id === RouteIds.OrganizationOverview)
  const isMembersActive = matches.some((match) => match.id === RouteIds.OrganizationMembers)
  const isSettingsActive = matches.some((match) => match.id === RouteIds.OrganizationSettings)
  const isLimitsActive = matches.some((match) => match.id === RouteIds.OrganizationLimits)

  return {
    isProjectsActive,
    isMembersActive,
    isSettingsActive,
    isLimitsActive,
  }
}
