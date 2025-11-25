import { ChangeType } from 'src/__generated__/graphql-request'

export const getChangeTypeBadgeColor = (changeType: string): string => {
  switch (changeType) {
    case 'ADDED':
      return 'green.500'
    case 'MODIFIED':
      return 'orange.500'
    case 'REMOVED':
      return 'red.500'
    case 'RENAMED':
      return 'blue.500'
    case 'RENAMED_AND_MODIFIED':
      return 'purple.500'
    default:
      return 'gray.500'
  }
}

export const getChangeTypeLabel = (changeType: string): string => {
  switch (changeType) {
    case 'ADDED':
      return 'Added'
    case 'MODIFIED':
      return 'Modified'
    case 'REMOVED':
      return 'Removed'
    case 'RENAMED':
      return 'Renamed'
    case 'RENAMED_AND_MODIFIED':
      return 'Renamed & Modified'
    default:
      return changeType
  }
}

export const changeTypeLabels: Record<ChangeType, string> = {
  [ChangeType.Added]: 'Added',
  [ChangeType.Modified]: 'Modified',
  [ChangeType.Removed]: 'Removed',
  [ChangeType.Renamed]: 'Renamed',
  [ChangeType.RenamedAndModified]: 'Renamed & Modified',
}

export const filterableChangeTypes = [ChangeType.Added, ChangeType.Modified, ChangeType.Removed, ChangeType.Renamed]
