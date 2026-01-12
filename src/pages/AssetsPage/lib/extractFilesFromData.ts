export interface FileData {
  fileId: string
  fileName: string
  mimeType: string
  size: number
  status: string
  url: string
  width: number
  height: number
  extension: string
  hash: string
}

export interface ExtractedFile {
  file: FileData
  tableId: string
  rowId: string
  fieldPath: string
}

const isFileObject = (value: unknown): value is FileData => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const obj = value as Record<string, unknown>
  return typeof obj.fileId === 'string' && typeof obj.fileName === 'string' && typeof obj.status === 'string'
}

const extractFilesRecursive = (
  data: unknown,
  path: string[],
  tableId: string,
  rowId: string,
  files: ExtractedFile[],
): void => {
  if (isFileObject(data)) {
    files.push({
      file: data,
      tableId,
      rowId,
      fieldPath: path.join('.'),
    })
    return
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      extractFilesRecursive(item, [...path, `[${index}]`], tableId, rowId, files)
    })
    return
  }

  if (typeof data === 'object' && data !== null) {
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      extractFilesRecursive(value, [...path, key], tableId, rowId, files)
    })
  }
}

export const extractFilesFromRowData = (data: unknown, tableId: string, rowId: string): ExtractedFile[] => {
  const files: ExtractedFile[] = []
  extractFilesRecursive(data, [], tableId, rowId, files)
  return files
}

export const extractFilesFromRows = (rows: Array<{ id: string; data: unknown }>, tableId: string): ExtractedFile[] => {
  return rows.flatMap((row) => extractFilesFromRowData(row.data, tableId, row.id))
}

export const extractFileByPath = (data: unknown, fieldPath: string): FileData | null => {
  if (!data || typeof data !== 'object') {
    return null
  }

  let current: unknown = data

  if (fieldPath) {
    const parts = fieldPath.split(/[.[\]]/).filter(Boolean)
    for (const part of parts) {
      if (current === null || current === undefined) {
        return null
      }
      if (typeof current === 'object') {
        current = (current as Record<string, unknown>)[part]
      } else {
        return null
      }
    }
  }

  if (!current || typeof current !== 'object') {
    return null
  }

  const obj = current as Record<string, unknown>
  if (typeof obj.fileId !== 'string') {
    return null
  }

  return {
    fileId: (obj.fileId as string) ?? '',
    fileName: (obj.fileName as string) ?? '',
    mimeType: (obj.mimeType as string) ?? '',
    size: (obj.size as number) ?? 0,
    status: (obj.status as string) ?? '',
    url: (obj.url as string) ?? '',
    width: (obj.width as number) ?? 0,
    height: (obj.height as number) ?? 0,
    extension: (obj.extension as string) ?? '',
    hash: (obj.hash as string) ?? '',
  }
}
