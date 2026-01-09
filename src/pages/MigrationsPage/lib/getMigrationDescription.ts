import { IconType } from 'react-icons'
import {
  PiArrowsLeftRightLight,
  PiMinusLight,
  PiPencilSimpleLight,
  PiPlusLight,
  PiTableLight,
  PiTextAaLight,
  PiTrashLight,
} from 'react-icons/pi'
import { PatchData } from 'src/pages/MigrationsPage/model/MigrationItemViewModel.ts'
import { convertSchemaPathToJsonPath } from './convertSchemaPathToJsonPath.ts'

export interface MessageSegment {
  text: string
  highlight?: boolean
  gray?: boolean
}

export interface MigrationDescription {
  icon: IconType
  segments: MessageSegment[]
}

function getFieldNameFromPath(path: string): string {
  const jsonPath = convertSchemaPathToJsonPath(path)
  return jsonPath || path
}

function getFieldType(patch: PatchData): string | null {
  const value = patch.patch.value
  if (!value || typeof value !== 'object') {
    return null
  }

  if ('$ref' in value && typeof value.$ref === 'string') {
    return value.$ref
  }

  if ('type' in value && typeof value.type === 'string') {
    return value.type
  }

  return null
}

function t(text: string): MessageSegment {
  return { text }
}

function h(text: string): MessageSegment {
  return { text, highlight: true }
}

function g(text: string): MessageSegment {
  return { text, gray: true }
}

function getOperationDescription(patch: PatchData): MigrationDescription {
  const { op, path, from } = patch.patch
  const tableId = patch.tableId
  const fieldName = getFieldNameFromPath(path)

  switch (op) {
    case 'add': {
      if (path === '/') {
        return {
          icon: PiTableLight,
          segments: [t('Table '), h(tableId), t(' was created')],
        }
      }
      const fieldType = getFieldType(patch)
      const typeSegment = fieldType ? [g(` (${fieldType})`)] : []
      return {
        icon: PiPlusLight,
        segments: [t('Field '), h(fieldName), ...typeSegment, t(' was added to table '), h(tableId)],
      }
    }

    case 'remove':
      return {
        icon: PiMinusLight,
        segments: [t('Field '), h(fieldName), t(' was removed from table '), h(tableId)],
      }

    case 'replace':
      return {
        icon: PiPencilSimpleLight,
        segments: [t('Field '), h(fieldName), t(' was modified in table '), h(tableId)],
      }

    case 'move':
      if (from) {
        const fromField = getFieldNameFromPath(from)
        return {
          icon: PiArrowsLeftRightLight,
          segments: [t('Renamed field '), h(fromField), t(' to '), h(fieldName), t(' in table '), h(tableId)],
        }
      }
      return {
        icon: PiArrowsLeftRightLight,
        segments: [t('Moved field to '), h(fieldName), t(' in table '), h(tableId)],
      }

    default:
      return {
        icon: PiPencilSimpleLight,
        segments: [t('Operation '), h(op), t(' on '), h(fieldName), t(' in table '), h(tableId)],
      }
  }
}

function getTableRenameDescription(tableId: string, nextTableId: string): MigrationDescription {
  return {
    icon: PiTextAaLight,
    segments: [t('Table '), h(tableId), t(' was renamed to '), h(nextTableId)],
  }
}

function getTableRemoveDescription(tableId: string): MigrationDescription {
  return {
    icon: PiTrashLight,
    segments: [t('Table '), h(tableId), t(' was removed')],
  }
}

export function getMigrationDescription(patch: PatchData): MigrationDescription {
  const { changeType } = patch.parentMigration

  switch (changeType) {
    case 'init':
      return {
        icon: PiTableLight,
        segments: [t('Table '), h(patch.tableId), t(' was created')],
      }

    case 'update':
      return getOperationDescription(patch)

    case 'rename': {
      const nextTableId = (patch.parentMigration as { nextTableId: string }).nextTableId
      return getTableRenameDescription(patch.tableId, nextTableId)
    }

    case 'remove':
      return getTableRemoveDescription(patch.tableId)

    default:
      return {
        icon: PiPencilSimpleLight,
        segments: [t('Unknown operation on table '), h(patch.tableId)],
      }
  }
}
