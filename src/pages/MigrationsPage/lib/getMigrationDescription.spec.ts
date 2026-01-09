import {
  PiArrowsLeftRightLight,
  PiMinusLight,
  PiPencilSimpleLight,
  PiPlusLight,
  PiTableLight,
  PiTextAaLight,
  PiTrashLight,
} from 'react-icons/pi'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import { PatchData } from 'src/pages/MigrationsPage/model/MigrationItemViewModel.ts'
import { getMigrationDescription, MessageSegment } from './getMigrationDescription.ts'

const createPatchData = (
  changeType: 'init' | 'update' | 'rename' | 'remove',
  tableId: string,
  patch: { op: string; path: string; from?: string; value?: JsonValue },
  overrides: Partial<MigrationData> = {},
): PatchData => ({
  migrationId: 'migration-1',
  tableId,
  patch,
  parentMigration: {
    id: 'migration-1',
    changeType,
    tableId,
    hash: 'abc123',
    schema: { type: 'object' },
    ...overrides,
  } as MigrationData,
})

function segmentsToText(segments: MessageSegment[]): string {
  return segments.map((s) => s.text).join('')
}

function getHighlightedTexts(segments: MessageSegment[]): string[] {
  return segments.filter((s) => s.highlight).map((s) => s.text)
}

function getGrayTexts(segments: MessageSegment[]): string[] {
  return segments.filter((s) => s.gray).map((s) => s.text)
}

describe('getMigrationDescription', () => {
  describe('init changeType', () => {
    it('should return table created message with table icon', () => {
      const patch = createPatchData('init', 'posts', { op: 'add', path: '/' })

      const result = getMigrationDescription(patch)

      expect(result.icon).toBe(PiTableLight)
      expect(segmentsToText(result.segments)).toBe('Table posts was created')
      expect(getHighlightedTexts(result.segments)).toEqual(['posts'])
    })
  })

  describe('remove changeType', () => {
    it('should return table removed message with trash icon', () => {
      const patch = createPatchData('remove', 'old_table', { op: 'remove', path: '/' })

      const result = getMigrationDescription(patch)

      expect(result.icon).toBe(PiTrashLight)
      expect(segmentsToText(result.segments)).toBe('Table old_table was removed')
      expect(getHighlightedTexts(result.segments)).toEqual(['old_table'])
    })
  })

  describe('rename changeType', () => {
    it('should return table renamed message with text icon', () => {
      const patch = createPatchData('rename', 'articles', { op: 'replace', path: '/' }, { nextTableId: 'posts' })

      const result = getMigrationDescription(patch)

      expect(result.icon).toBe(PiTextAaLight)
      expect(segmentsToText(result.segments)).toBe('Table articles was renamed to posts')
      expect(getHighlightedTexts(result.segments)).toEqual(['articles', 'posts'])
    })
  })

  describe('update changeType', () => {
    describe('add operation', () => {
      it('should return table created message when path is root', () => {
        const patch = createPatchData('update', 'users', { op: 'add', path: '/' })

        const result = getMigrationDescription(patch)

        expect(result.icon).toBe(PiTableLight)
        expect(segmentsToText(result.segments)).toBe('Table users was created')
        expect(getHighlightedTexts(result.segments)).toEqual(['users'])
      })

      it('should return field added message for property path', () => {
        const patch = createPatchData('update', 'users', { op: 'add', path: '/properties/email' })

        const result = getMigrationDescription(patch)

        expect(result.icon).toBe(PiPlusLight)
        expect(segmentsToText(result.segments)).toBe('Field email was added to table users')
        expect(getHighlightedTexts(result.segments)).toEqual(['email', 'users'])
      })

      it('should include field type when value has type property', () => {
        const patch = createPatchData('update', 'users', {
          op: 'add',
          path: '/properties/email',
          value: { type: 'string', default: '' },
        })

        const result = getMigrationDescription(patch)

        expect(result.icon).toBe(PiPlusLight)
        expect(segmentsToText(result.segments)).toBe('Field email (string) was added to table users')
        expect(getHighlightedTexts(result.segments)).toEqual(['email', 'users'])
        expect(getGrayTexts(result.segments)).toEqual([' (string)'])
      })

      it('should include field type when value has $ref property', () => {
        const patch = createPatchData('update', 'users', {
          op: 'add',
          path: '/properties/avatar',
          value: { $ref: 'File' },
        })

        const result = getMigrationDescription(patch)

        expect(result.icon).toBe(PiPlusLight)
        expect(segmentsToText(result.segments)).toBe('Field avatar (File) was added to table users')
        expect(getHighlightedTexts(result.segments)).toEqual(['avatar', 'users'])
        expect(getGrayTexts(result.segments)).toEqual([' (File)'])
      })

      it('should not include type when value is missing', () => {
        const patch = createPatchData('update', 'users', { op: 'add', path: '/properties/name' })

        const result = getMigrationDescription(patch)

        expect(segmentsToText(result.segments)).toBe('Field name was added to table users')
      })
    })

    describe('remove operation', () => {
      it('should return field removed message', () => {
        const patch = createPatchData('update', 'users', { op: 'remove', path: '/properties/old_field' })

        const result = getMigrationDescription(patch)

        expect(result.icon).toBe(PiMinusLight)
        expect(segmentsToText(result.segments)).toBe('Field old_field was removed from table users')
        expect(getHighlightedTexts(result.segments)).toEqual(['old_field', 'users'])
      })
    })

    describe('replace operation', () => {
      it('should return field modified message', () => {
        const patch = createPatchData('update', 'users', { op: 'replace', path: '/properties/name' })

        const result = getMigrationDescription(patch)

        expect(result.icon).toBe(PiPencilSimpleLight)
        expect(segmentsToText(result.segments)).toBe('Field name was modified in table users')
        expect(getHighlightedTexts(result.segments)).toEqual(['name', 'users'])
      })
    })

    describe('move operation', () => {
      it('should return field renamed message when from is provided', () => {
        const patch = createPatchData('update', 'users', {
          op: 'move',
          path: '/properties/fullName',
          from: '/properties/name',
        })

        const result = getMigrationDescription(patch)

        expect(result.icon).toBe(PiArrowsLeftRightLight)
        expect(segmentsToText(result.segments)).toBe('Renamed field name to fullName in table users')
        expect(getHighlightedTexts(result.segments)).toEqual(['name', 'fullName', 'users'])
      })

      it('should return field moved message when from is not provided', () => {
        const patch = createPatchData('update', 'users', { op: 'move', path: '/properties/newLocation' })

        const result = getMigrationDescription(patch)

        expect(result.icon).toBe(PiArrowsLeftRightLight)
        expect(segmentsToText(result.segments)).toBe('Moved field to newLocation in table users')
        expect(getHighlightedTexts(result.segments)).toEqual(['newLocation', 'users'])
      })
    })

    describe('unknown operation', () => {
      it('should return generic operation message', () => {
        const patch = createPatchData('update', 'users', { op: 'copy', path: '/properties/field' })

        const result = getMigrationDescription(patch)

        expect(result.icon).toBe(PiPencilSimpleLight)
        expect(segmentsToText(result.segments)).toBe('Operation copy on field in table users')
        expect(getHighlightedTexts(result.segments)).toEqual(['copy', 'field', 'users'])
      })
    })
  })

  describe('unknown changeType', () => {
    it('should return unknown operation message', () => {
      const patch = createPatchData('unknown' as 'init', 'users', { op: 'add', path: '/' })

      const result = getMigrationDescription(patch)

      expect(result.icon).toBe(PiPencilSimpleLight)
      expect(segmentsToText(result.segments)).toBe('Unknown operation on table users')
      expect(getHighlightedTexts(result.segments)).toEqual(['users'])
    })
  })
})
