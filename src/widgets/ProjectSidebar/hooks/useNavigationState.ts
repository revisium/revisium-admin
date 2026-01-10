import { useMatches } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useNavigationState = () => {
  const matches = useMatches()

  const isChangesActive = matches.some((match) => match.id === RouteIds.Changes)
  const isMigrationsActive = matches.some((match) => match.id === RouteIds.Migrations)
  const isProjectSettingsActive = matches.some((match) => match.id === RouteIds.ProjectSettings)
  const isEndpointsActive = matches.some((match) => match.id === RouteIds.Endpoints)
  const isBranchesActive = matches.some((match) => match.id === RouteIds.Branches)
  const isProjectUsersActive = matches.some((match) => match.id === RouteIds.ProjectUsers)
  const isMcpActive = matches.some((match) => match.id === RouteIds.ProjectMcp)

  const isTablesActive =
    matches.some((match) => match.id === RouteIds.Revision) && !isMigrationsActive && !isChangesActive
  const isProjectLevelActive =
    isProjectSettingsActive || isEndpointsActive || isBranchesActive || isProjectUsersActive || isMcpActive

  return {
    isTablesActive,
    isChangesActive,
    isMigrationsActive,
    isProjectSettingsActive,
    isEndpointsActive,
    isBranchesActive,
    isProjectUsersActive,
    isMcpActive,
    isProjectLevelActive,
  }
}
