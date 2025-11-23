import { useMatches } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useNavigationState = () => {
  const matches = useMatches()

  const isChangesActive = matches.some((match) => match.id === RouteIds.Changes)
  const isMigrationsActive = matches.some((match) => match.id === RouteIds.Migrations)
  const isProjectSettingsActive = matches.some((match) => match.id === RouteIds.ProjectSettings)

  const isTablesActive =
    matches.some((match) => match.id === RouteIds.Revision) && !isMigrationsActive && !isChangesActive
  const isProjectLevelActive = isProjectSettingsActive

  return {
    isTablesActive,
    isChangesActive,
    isMigrationsActive,
    isProjectSettingsActive,
    isProjectLevelActive,
  }
}
