import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { type ObjectValueNodeInterface as ObjectValueNode } from '@revisium/schema-toolkit-ui'
import { JsonValue } from 'src/entities/Schema/types/json.types'
import { container } from 'src/shared/lib/DIContainer'
import { FileService } from 'src/shared/model/FileService'
import { toaster } from 'src/shared/ui'

interface UseFileUploadOptions {
  revisionId: string
  tableId: string
  rowId: string
  onError?: (error: Error) => void
}

interface UseFileUploadResult {
  upload: (fileId: string, file: File, node: ObjectValueNode) => Promise<boolean>
}

const MAX_RECURSION_DEPTH = 20

const findFileDataByFileId = (data: JsonValue, fileId: string, depth = 0): Record<string, JsonValue> | undefined => {
  if (depth > MAX_RECURSION_DEPTH) {
    return undefined
  }

  if (typeof data !== 'object' || data === null) {
    return undefined
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const result = findFileDataByFileId(item, fileId, depth + 1)
      if (result) return result
    }
    return undefined
  }

  const obj = data as Record<string, JsonValue>
  if (obj.fileId === fileId) {
    return obj
  }

  for (const value of Object.values(obj)) {
    const result = findFileDataByFileId(value, fileId, depth + 1)

    if (result) {
      return result
    }
  }

  return undefined
}

function updateNodeFromFileData(node: ObjectValueNode, fileData: Record<string, JsonValue>): void {
  for (const [key, value] of Object.entries(fileData)) {
    const child = node.child(key)
    if (child?.isPrimitive()) {
      child.setValue(value, { internal: true })
    }
  }
}

export const useFileUpload = ({ revisionId, tableId, rowId, onError }: UseFileUploadOptions): UseFileUploadResult => {
  const upload = useCallback(
    async (fileId: string, file: File, node: ObjectValueNode): Promise<boolean> => {
      const fileService = container.get(FileService)
      const toastId = nanoid()

      toaster.loading({ id: toastId, title: 'Uploading...' })

      try {
        const result = await fileService.add({
          revisionId,
          tableId,
          rowId,
          fileId,
          file,
        })

        toaster.update(toastId, {
          type: 'info',
          title: 'Successfully uploaded!',
          duration: 1500,
        })

        if (result.row?.data) {
          const fileData = findFileDataByFileId(result.row.data as JsonValue, fileId)
          if (fileData) {
            updateNodeFromFileData(node, fileData)
          }
        }

        return true
      } catch (error) {
        toaster.update(toastId, {
          type: 'error',
          title: 'Upload failed',
          duration: 3000,
        })

        onError?.(error instanceof Error ? error : new Error('Upload failed'))
        return false
      }
    },
    [revisionId, tableId, rowId, onError],
  )

  return { upload }
}
