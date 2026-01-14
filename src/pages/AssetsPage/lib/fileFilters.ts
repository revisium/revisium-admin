import { ExtractedFile } from './extractFilesFromData'

export type FileTypeFilter = 'all' | 'images' | 'documents' | 'audio' | 'video' | 'other'
export type FileStatusFilter = 'all' | 'uploaded' | 'ready'
export type FileSizeFilter = 'all' | 'small' | 'medium' | 'large' | 'xlarge'

export interface AssetsFilter {
  search: string
  type: FileTypeFilter
  status: FileStatusFilter
  size: FileSizeFilter
  tableId: string | null
}

export const SIZE_THRESHOLDS = {
  small: 100 * 1024,
  medium: 1024 * 1024,
  large: 10 * 1024 * 1024,
}

export const MIME_TYPE_PREFIXES: Record<Exclude<FileTypeFilter, 'all' | 'other'>, string[]> = {
  images: ['image/'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.', 'text/'],
  audio: ['audio/'],
  video: ['video/'],
}

export const getAllKnownMimePrefixes = (): string[] => {
  return [
    ...MIME_TYPE_PREFIXES.images,
    ...MIME_TYPE_PREFIXES.documents,
    ...MIME_TYPE_PREFIXES.audio,
    ...MIME_TYPE_PREFIXES.video,
  ]
}

export const matchesTypeFilter = (mimeType: string, filter: FileTypeFilter): boolean => {
  if (filter === 'all') {
    return true
  }

  if (filter === 'other') {
    const knownPrefixes = getAllKnownMimePrefixes()
    return !knownPrefixes.some((prefix) => mimeType.startsWith(prefix))
  }

  const prefixes = MIME_TYPE_PREFIXES[filter]
  return prefixes.some((prefix) => mimeType.startsWith(prefix))
}

export const matchesSizeFilter = (size: number, filter: FileSizeFilter): boolean => {
  switch (filter) {
    case 'all':
      return true
    case 'small':
      return size < SIZE_THRESHOLDS.small
    case 'medium':
      return size >= SIZE_THRESHOLDS.small && size < SIZE_THRESHOLDS.medium
    case 'large':
      return size >= SIZE_THRESHOLDS.medium && size < SIZE_THRESHOLDS.large
    case 'xlarge':
      return size >= SIZE_THRESHOLDS.large
    default:
      return true
  }
}

export const matchesStatusFilter = (status: string, filter: FileStatusFilter): boolean => {
  if (filter === 'all') {
    return true
  }
  return status === filter
}

export const matchesSearchFilter = (fileName: string, search: string): boolean => {
  if (!search.trim()) {
    return true
  }
  return fileName.toLowerCase().includes(search.toLowerCase())
}

export const matchesTableFilter = (tableId: string, filterTableId: string | null): boolean => {
  if (!filterTableId) {
    return true
  }
  return tableId === filterTableId
}

export const filterFiles = (files: ExtractedFile[], filter: AssetsFilter): ExtractedFile[] => {
  return files.filter((extractedFile) => {
    const { file, tableId } = extractedFile

    return (
      matchesSearchFilter(file.fileName, filter.search) &&
      matchesTypeFilter(file.mimeType, filter.type) &&
      matchesStatusFilter(file.status, filter.status) &&
      matchesSizeFilter(file.size, filter.size) &&
      matchesTableFilter(tableId, filter.tableId)
    )
  })
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = bytes / Math.pow(k, i)

  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`
}

export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/')
}

export const getFileTypeLabel = (filter: FileTypeFilter): string => {
  const labels: Record<FileTypeFilter, string> = {
    all: 'All types',
    images: 'Images',
    documents: 'Documents',
    audio: 'Audio',
    video: 'Video',
    other: 'Other',
  }
  return labels[filter]
}

export const getFileSizeLabel = (filter: FileSizeFilter): string => {
  const labels: Record<FileSizeFilter, string> = {
    all: 'All sizes',
    small: '< 100 KB',
    medium: '100 KB - 1 MB',
    large: '1 MB - 10 MB',
    xlarge: '> 10 MB',
  }
  return labels[filter]
}

export const getFileStatusLabel = (filter: FileStatusFilter): string => {
  const labels: Record<FileStatusFilter, string> = {
    all: 'All statuses',
    uploaded: 'Uploaded',
    ready: 'Pending upload',
  }
  return labels[filter]
}

export const createDefaultFilter = (): AssetsFilter => ({
  search: '',
  type: 'all',
  status: 'all',
  size: 'all',
  tableId: null,
})
