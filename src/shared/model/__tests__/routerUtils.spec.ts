import { Location } from '@remix-run/router'
import { extractLocationData, extractMatchedRouteIds, extractParamsFromMatches, RouteMatch } from '../routerUtils'

const createMatch = (params: Record<string, string>, routeId?: string): RouteMatch => ({
  params,
  pathname: '/',
  pathnameBase: '/',
  route: { id: routeId },
})

const createLocation = (overrides: Partial<Location> = {}): Location => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
  ...overrides,
})

describe('routerUtils', () => {
  describe('extractParamsFromMatches', () => {
    it('should return empty object for empty matches', () => {
      const result = extractParamsFromMatches([])

      expect(result).toEqual({})
    })

    it('should extract params from single match', () => {
      const matches = [createMatch({ organizationId: 'org-1', projectName: 'project-1' })]

      const result = extractParamsFromMatches(matches)

      expect(result).toEqual({
        organizationId: 'org-1',
        projectName: 'project-1',
      })
    })

    it('should merge params from multiple matches', () => {
      const matches = [
        createMatch({ organizationId: 'org-1' }),
        createMatch({ projectName: 'project-1' }),
        createMatch({ branchName: 'main' }),
      ]

      const result = extractParamsFromMatches(matches)

      expect(result).toEqual({
        organizationId: 'org-1',
        projectName: 'project-1',
        branchName: 'main',
      })
    })

    it('should override params from earlier matches with later ones', () => {
      const matches = [createMatch({ tableId: 'users', rowId: 'old-row' }), createMatch({ rowId: 'new-row' })]

      const result = extractParamsFromMatches(matches)

      expect(result).toEqual({
        tableId: 'users',
        rowId: 'new-row',
      })
    })

    it('should handle matches with empty params', () => {
      const matches = [createMatch({}), createMatch({ organizationId: 'org-1' }), createMatch({})]

      const result = extractParamsFromMatches(matches)

      expect(result).toEqual({ organizationId: 'org-1' })
    })
  })

  describe('extractMatchedRouteIds', () => {
    it('should return empty set for empty matches', () => {
      const result = extractMatchedRouteIds([])

      expect(result.size).toBe(0)
    })

    it('should extract route ids from matches', () => {
      const matches = [createMatch({}, 'root'), createMatch({}, 'project'), createMatch({}, 'table')]

      const result = extractMatchedRouteIds(matches)

      expect(result).toEqual(new Set(['root', 'project', 'table']))
    })

    it('should skip matches without route id', () => {
      const matches = [createMatch({}, 'root'), createMatch({}), createMatch({}, 'project')]

      const result = extractMatchedRouteIds(matches)

      expect(result).toEqual(new Set(['root', 'project']))
    })

    it('should handle all matches without route ids', () => {
      const matches = [createMatch({}), createMatch({})]

      const result = extractMatchedRouteIds(matches)

      expect(result.size).toBe(0)
    })
  })

  describe('extractLocationData', () => {
    it('should extract pathname, search, and hash from location', () => {
      const location = createLocation({
        pathname: '/org/project/tables',
        search: '?filter=active',
        hash: '#section',
      })

      const result = extractLocationData(location)

      expect(result).toEqual({
        pathname: '/org/project/tables',
        search: '?filter=active',
        hash: '#section',
      })
    })

    it('should handle empty search and hash', () => {
      const location = createLocation({
        pathname: '/dashboard',
        search: '',
        hash: '',
      })

      const result = extractLocationData(location)

      expect(result).toEqual({
        pathname: '/dashboard',
        search: '',
        hash: '',
      })
    })

    it('should not include state or key from location', () => {
      const location = createLocation({
        pathname: '/',
        state: { some: 'data' },
        key: 'abc123',
      })

      const result = extractLocationData(location)

      expect(result).toEqual({
        pathname: '/',
        search: '',
        hash: '',
      })
      expect(result).not.toHaveProperty('state')
      expect(result).not.toHaveProperty('key')
    })
  })
})
