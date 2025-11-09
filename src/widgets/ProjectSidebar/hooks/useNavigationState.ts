import { useLocation, useMatches } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useNavigationState = () => {
  const matches = useMatches()
  const location = useLocation()

  const isInBranchContext = matches.some((match) => match.id === RouteIds.Branch)

  const isTablesActive =
    isInBranchContext &&
    matches.some((match) =>
      [RouteIds.HeadRevision, RouteIds.DraftRevision, RouteIds.SpecificRevision].includes(match.id as RouteIds),
    )

  const isProjectSettingsActive = matches.some((match) => match.id === RouteIds.ProjectSettings)
  const isProjectUsersActive = matches.some((match) => match.id === RouteIds.ProjectUsers)
  const isProjectApiKeysActive = matches.some((match) => match.id === RouteIds.ProjectApiKeys)

  const isMigrationsActive = location.pathname.includes('-/migrations')
  const isChangesActive = location.pathname.includes('-/changes')
  const isAssetsActive = location.pathname.includes('-/assets')

  return {
    isInBranchContext,
    isTablesActive,
    isProjectSettingsActive,
    isProjectUsersActive,
    isProjectApiKeysActive,
    isMigrationsActive,
    isChangesActive,
    isAssetsActive,
  }
}
