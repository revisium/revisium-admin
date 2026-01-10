import { useMatches } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useNavigationState = () => {
  const matches = useMatches()

  const isChangesActive = matches.some((match) => match.id === RouteIds.Changes)
  const isMigrationsActive = matches.some((match) => match.id === RouteIds.Migrations)
  const isRelationsActive = matches.some((match) => match.id === RouteIds.Relations)
  const isBranchMapActive = matches.some((match) => match.id === RouteIds.BranchMap)
  const isProjectSettingsActive = matches.some((match) => match.id === RouteIds.ProjectSettings)
  const isEndpointsActive = matches.some((match) => match.id === RouteIds.Endpoints)
  const isBranchesActive = matches.some((match) => match.id === RouteIds.Branches)
  const isProjectUsersActive = matches.some((match) => match.id === RouteIds.ProjectUsers)
  const isMcpActive = matches.some((match) => match.id === RouteIds.ProjectMcp)

  const isTablesActive =
    matches.some((match) => match.id === RouteIds.Revision) &&
    !isMigrationsActive &&
    !isChangesActive &&
    !isRelationsActive &&
    !isBranchMapActive
  const isBranchesLevelActive = isBranchesActive || isBranchMapActive
  const isProjectLevelActive = isProjectSettingsActive || isEndpointsActive || isProjectUsersActive || isMcpActive

  return {
    isTablesActive,
    isChangesActive,
    isMigrationsActive,
    isProjectSettingsActive,
    isEndpointsActive,
    isProjectUsersActive,
    isMcpActive,
    isProjectLevelActive,
    isBranchesLevelActive,
    isBranchesActive,
    isRelationsActive,
    isBranchMapActive,
  }
}
