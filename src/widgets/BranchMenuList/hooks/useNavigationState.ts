import { useMatches } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useNavigationState = () => {
  const matches = useMatches()

  const isTablesActive = matches.some((match) =>
    [RouteIds.HeadRevision, RouteIds.DraftRevision, RouteIds.SpecificRevision].includes(match.id as RouteIds),
  )

  const isMigrationsActive = matches.some((match) => match.pathname?.includes('-/migrations'))

  return {
    isTablesActive,
    isMigrationsActive,
  }
}
