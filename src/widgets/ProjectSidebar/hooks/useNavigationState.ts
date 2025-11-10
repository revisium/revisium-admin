import { useMatches } from 'react-router-dom'
import { RouteIds } from 'src/shared/config/routes.ts'

export const useNavigationState = () => {
  const matches = useMatches()

  const isMigrationsActive = matches.some((match) => match.id === RouteIds.Migrations)

  const isTablesActive = matches.some((match) => match.id === RouteIds.Revision) && !isMigrationsActive

  return {
    isTablesActive,
    isMigrationsActive,
  }
}
