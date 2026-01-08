import { autorun } from 'mobx'
import { RouterParams } from '../RouterParams'

const ALL_PARAM_KEYS = ['organizationId', 'projectName', 'branchName', 'revisionIdOrTag', 'tableId', 'rowId'] as const

const expectAllNull = (params: RouterParams) => {
  for (const key of ALL_PARAM_KEYS) {
    expect(params[key]).toBeNull()
  }
}

const expectParams = (
  params: RouterParams,
  expected: Partial<Record<(typeof ALL_PARAM_KEYS)[number], string | null>>,
) => {
  for (const key of ALL_PARAM_KEYS) {
    expect(params[key]).toBe(expected[key] ?? null)
  }
}

describe('RouterParams', () => {
  let params: RouterParams

  beforeEach(() => {
    params = new RouterParams()
  })

  describe('initial state', () => {
    it('should have all fields as null', () => {
      expectAllNull(params)
    })
  })

  describe('update', () => {
    it('should update all fields from params object', () => {
      params.update({
        organizationId: 'org-1',
        projectName: 'project-1',
        branchName: 'main',
        revisionIdOrTag: 'draft',
        tableId: 'users',
        rowId: 'row-1',
      })

      expectParams(params, {
        organizationId: 'org-1',
        projectName: 'project-1',
        branchName: 'main',
        revisionIdOrTag: 'draft',
        tableId: 'users',
        rowId: 'row-1',
      })
    })

    it('should set missing fields to null', () => {
      params.update({
        organizationId: 'org-1',
        projectName: 'project-1',
        branchName: 'main',
        revisionIdOrTag: 'draft',
        tableId: 'users',
        rowId: 'row-1',
      })

      params.update({
        organizationId: 'org-1',
        projectName: 'project-1',
      })

      expectParams(params, {
        organizationId: 'org-1',
        projectName: 'project-1',
      })
    })

    it('should handle undefined values as null', () => {
      params.update({
        organizationId: undefined,
        projectName: undefined,
      })

      expectAllNull(params)
    })

    it('should handle empty object', () => {
      params.update({
        organizationId: 'org-1',
        projectName: 'project-1',
      })

      params.update({})

      expectAllNull(params)
    })
  })

  describe('clear', () => {
    it('should reset all fields to null', () => {
      params.update({
        organizationId: 'org-1',
        projectName: 'project-1',
        branchName: 'main',
        revisionIdOrTag: 'draft',
        tableId: 'users',
        rowId: 'row-1',
      })

      params.clear()

      expectAllNull(params)
    })
  })

  describe('reactivity', () => {
    it('should trigger reactions when fields change', () => {
      const observed: (string | null)[] = []

      const dispose = autorun(() => {
        observed.push(params.organizationId)
      })

      params.update({ organizationId: 'org-1' })
      params.update({ organizationId: 'org-2' })
      params.clear()

      dispose()

      expect(observed).toEqual([null, 'org-1', 'org-2', null])
    })

    it('should allow granular subscriptions to individual fields', () => {
      const orgChanges: (string | null)[] = []
      const tableChanges: (string | null)[] = []

      const disposeOrg = autorun(() => {
        orgChanges.push(params.organizationId)
      })
      const disposeTable = autorun(() => {
        tableChanges.push(params.tableId)
      })

      params.update({ organizationId: 'org-1' })
      params.update({ organizationId: 'org-1', tableId: 'users' })
      params.update({ organizationId: 'org-1', tableId: 'posts' })

      disposeOrg()
      disposeTable()

      expect(orgChanges).toEqual([null, 'org-1'])
      expect(tableChanges).toEqual([null, 'users', 'posts'])
    })
  })
})
