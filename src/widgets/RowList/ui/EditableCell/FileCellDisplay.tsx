import { Box, HoverCard, IconButton, Image, Portal } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { PiFile, PiUploadSimple } from 'react-icons/pi'
import { type ObjectValueNodeInterface as ObjectValueNode } from '@revisium/schema-toolkit-ui'
import { Tooltip } from 'src/shared/ui'

interface FileCellDisplayProps {
  node: ObjectValueNode
  isReadonly?: boolean
  onUpload?: (fileId: string, file: File, node: ObjectValueNode) => void
}

export const FileCellDisplay: FC<FileCellDisplayProps> = observer(({ node, isReadonly, onUpload }) => {
  const status = node.child('status')?.value as string ?? ''
  const fileId = node.child('fileId')?.value as string ?? ''
  const url = node.child('url')?.value as string ?? ''
  const mimeType = node.child('mimeType')?.value as string ?? ''
  const width = node.child('width')?.value as number ?? 0
  const height = node.child('height')?.value as number ?? 0

  const isImage = mimeType.startsWith('image/')
  const hasUrl = Boolean(url)
  const canUpload = !isReadonly && (status === 'ready' || status === 'uploaded')

  const handleOpenFile = useCallback(() => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }, [url])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      onUpload?.(fileId, file, node)
      event.target.value = ''
    },
    [fileId, onUpload, node],
  )

  const inputId = `file-cell-${fileId}`

  if (!hasUrl && !canUpload) {
    if (isReadonly) {
      return null
    }
    return (
      <Tooltip
        openDelay={50}
        closeDelay={50}
        positioning={{ placement: 'right' }}
        content="Save row first to upload file"
      >
        <Box display="flex" alignItems="center" color="gray.400" cursor="default">
          <PiFile />
        </Box>
      </Tooltip>
    )
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap={1} role="group" width="100%">
      {hasUrl && (
        <>
          {isImage ? (
            <HoverCard.Root lazyMount unmountOnExit openDelay={350} closeDelay={100} positioning={{ gutter: 16 }}>
              <HoverCard.Trigger>
                <IconButton
                  aria-label="Preview file"
                  size="xs"
                  variant="ghost"
                  color="gray.500"
                  _hover={{ color: 'gray.700', bg: 'gray.100' }}
                  onClick={handleOpenFile}
                >
                  <PiFile />
                </IconButton>
              </HoverCard.Trigger>
              <Portal>
                <HoverCard.Positioner>
                  <HoverCard.Content>
                    <HoverCard.Arrow>
                      <HoverCard.ArrowTip />
                    </HoverCard.Arrow>
                    <Image aspectRatio={width > 0 && height > 0 ? width / height : 1} width="300px" src={url} />
                  </HoverCard.Content>
                </HoverCard.Positioner>
              </Portal>
            </HoverCard.Root>
          ) : (
            <IconButton
              aria-label="Open file"
              size="xs"
              variant="ghost"
              color="gray.500"
              _hover={{ color: 'gray.700', bg: 'gray.100' }}
              onClick={handleOpenFile}
            >
              <PiFile />
            </IconButton>
          )}
        </>
      )}

      {canUpload && (
        <Box opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.15s">
          <input type="file" onChange={handleFileChange} id={inputId} style={{ display: 'none' }} />
          <label htmlFor={inputId}>
            <IconButton
              as="span"
              aria-label="Upload file"
              size="xs"
              variant="ghost"
              color={hasUrl ? 'gray.400' : 'gray.500'}
              _hover={{ color: 'gray.700', bg: 'gray.100' }}
              cursor="pointer"
            >
              <PiUploadSimple />
            </IconButton>
          </label>
        </Box>
      )}
    </Box>
  )
})
