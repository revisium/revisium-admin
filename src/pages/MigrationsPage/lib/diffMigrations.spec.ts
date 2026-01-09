import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import { diffMigrations, getDiffSummary, getMigrationsToApply, hasConflicts } from './diffMigrations.ts'

const createMigration = (id: string, tableId = 'table1'): MigrationData => ({
  id,
  changeType: 'init',
  tableId,
  hash: 'abc123',
  schema: { type: 'object' },
})

describe('diffMigrations', () => {
  describe('when source migrations are empty', () => {
    it('should return empty array', () => {
      const result = diffMigrations([], [createMigration('1')])
      expect(result).toEqual([])
    })
  })

  describe('when existing migrations are empty', () => {
    it('should mark all source migrations as apply', () => {
      const source = [createMigration('1'), createMigration('2')]
      const result = diffMigrations(source, [])

      expect(result).toHaveLength(2)
      expect(result[0].status).toBe('apply')
      expect(result[1].status).toBe('apply')
    })
  })

  describe('when migration already exists', () => {
    it('should mark as skip with reason', () => {
      const migration = createMigration('1')
      const result = diffMigrations([migration], [migration])

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('skip')
      expect(result[0].reason).toBe('Already applied')
    })
  })

  describe('when migration id is after last existing', () => {
    it('should mark as apply', () => {
      const existing = [createMigration('1')]
      const source = [createMigration('2')]
      const result = diffMigrations(source, existing)

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('apply')
    })
  })

  describe('when migration id is before last existing (conflict)', () => {
    it('should mark as conflict', () => {
      const existing = [createMigration('5')]
      const source = [createMigration('3')]
      const result = diffMigrations(source, existing)

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('conflict')
      expect(result[0].reason).toContain('Migration ID must be after')
    })
  })

  describe('when migration id equals last existing (conflict)', () => {
    it('should mark as conflict when id equals last existing but not in set', () => {
      const existing = [createMigration('3')]
      const source = [createMigration('3', 'different-table')]
      const result = diffMigrations(source, existing)

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('skip')
    })
  })

  describe('when there is a conflict, subsequent migrations are blocked', () => {
    it('should mark migrations after conflict as blocked', () => {
      const existing = [createMigration('5')]
      const source = [createMigration('3'), createMigration('6'), createMigration('7')]
      const result = diffMigrations(source, existing)

      expect(result).toHaveLength(3)
      expect(result[0].status).toBe('conflict')
      expect(result[1].status).toBe('blocked')
      expect(result[1].reason).toBe('Blocked by previous conflict')
      expect(result[2].status).toBe('blocked')
    })
  })

  describe('mixed scenario', () => {
    it('should handle skip, apply, conflict, and blocked statuses', () => {
      const existing = [createMigration('1'), createMigration('3'), createMigration('5')]
      const source = [createMigration('1'), createMigration('4'), createMigration('6')]
      const result = diffMigrations(source, existing)

      expect(result).toHaveLength(3)
      expect(result[0].status).toBe('skip')
      expect(result[1].status).toBe('conflict')
      expect(result[2].status).toBe('blocked')
    })
  })

  describe('all new migrations after existing', () => {
    it('should mark all as apply when ids are sequential', () => {
      const existing = [createMigration('1'), createMigration('2')]
      const source = [createMigration('3'), createMigration('4'), createMigration('5')]
      const result = diffMigrations(source, existing)

      expect(result).toHaveLength(3)
      expect(result.every((r) => r.status === 'apply')).toBe(true)
    })
  })
})

describe('getMigrationsToApply', () => {
  it('should return only migrations with apply status', () => {
    const existing = [createMigration('2')]
    const source = [createMigration('1'), createMigration('3')]
    const diffResult = diffMigrations(source, existing)

    const toApply = getMigrationsToApply(diffResult)

    expect(toApply).toHaveLength(0)
  })

  it('should return migrations when all are applicable', () => {
    const source = [createMigration('1'), createMigration('2')]
    const diffResult = diffMigrations(source, [])

    const toApply = getMigrationsToApply(diffResult)

    expect(toApply).toHaveLength(2)
    expect(toApply[0].id).toBe('1')
    expect(toApply[1].id).toBe('2')
  })
})

describe('hasConflicts', () => {
  it('should return false when no conflicts', () => {
    const source = [createMigration('1')]
    const diffResult = diffMigrations(source, [])

    expect(hasConflicts(diffResult)).toBe(false)
  })

  it('should return true when there is a conflict', () => {
    const existing = [createMigration('5')]
    const source = [createMigration('3')]
    const diffResult = diffMigrations(source, existing)

    expect(hasConflicts(diffResult)).toBe(true)
  })
})

describe('getDiffSummary', () => {
  it('should count all status types correctly', () => {
    const existing = [createMigration('3')]
    const source = [createMigration('3'), createMigration('2'), createMigration('4'), createMigration('5')]
    const diffResult = diffMigrations(source, existing)

    const summary = getDiffSummary(diffResult)

    expect(summary.toSkip).toBe(1)
    expect(summary.conflicts).toBe(1)
    expect(summary.blocked).toBe(2)
    expect(summary.toApply).toBe(0)
  })

  it('should return zeros for empty input', () => {
    const summary = getDiffSummary([])

    expect(summary.toApply).toBe(0)
    expect(summary.toSkip).toBe(0)
    expect(summary.conflicts).toBe(0)
    expect(summary.blocked).toBe(0)
  })
})
