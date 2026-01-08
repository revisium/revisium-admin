import { AgnosticDataRouteMatch, AgnosticRouteMatch, Location } from '@remix-run/router'

export type RouteMatch = AgnosticDataRouteMatch | AgnosticRouteMatch

export interface LocationData {
  pathname: string
  search: string
  hash: string
}

export function extractParamsFromMatches(matches: RouteMatch[]): Record<string, string | undefined> {
  const allParams: Record<string, string | undefined> = {}
  for (const match of matches) {
    Object.assign(allParams, match.params)
  }
  return allParams
}

export function extractMatchedRouteIds(matches: RouteMatch[]): Set<string> {
  const ids = new Set<string>()
  for (const match of matches) {
    if (match.route.id) {
      ids.add(match.route.id)
    }
  }
  return ids
}

export function extractLocationData(location: Location): LocationData {
  return {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  }
}
