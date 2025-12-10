import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { container } from 'src/shared/lib/DIContainer'
import { FileService } from 'src/shared/model/FileService'
import { toaster } from 'src/shared/ui'

interface UseFileUploadOptions {
  revisionId: string
  tableId: string
  rowId: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

interface UseFileUploadResult {
  upload: (fileId: string, file: File) => Promise<boolean>
}

export const useFileUpload = ({
  revisionId,
  tableId,
  rowId,
  onSuccess,
  onError,
}: UseFileUploadOptions): UseFileUploadResult => {
  const upload = useCallback(
    async (fileId: string, file: File): Promise<boolean> => {
      const fileService = container.get(FileService)
      const toastId = nanoid()

      toaster.loading({ id: toastId, title: 'Uploading...' })

      try {
        await fileService.add({
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

        onSuccess?.()
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
    [revisionId, tableId, rowId, onSuccess, onError],
  )

  return { upload }
}
