import { useMatches } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useNavigationState = () => {
  const matches = useMatches()

  const isChangesActive = matches.some((match) => match.id === RouteIds.Changes)
  const isMigrationsActive = matches.some((match) => match.id === RouteIds.Migrations)
  const isProjectSettingsActive = matches.some((match) => match.id === RouteIds.ProjectSettings)
  const isEndpointsActive = matches.some((match) => match.id === RouteIds.Endpoints)
  const isProjectUsersActive = matches.some((match) => match.id === RouteIds.ProjectUsers)

  const isTablesActive =
    matches.some((match) => match.id === RouteIds.Revision) && !isMigrationsActive && !isChangesActive
  const isProjectLevelActive = isProjectSettingsActive || isEndpointsActive || isProjectUsersActive

  return {
    isTablesActive,
    isChangesActive,
    isMigrationsActive,
    isProjectSettingsActive,
    isEndpointsActive,
    isProjectUsersActive,
    isProjectLevelActive,
  }
}
