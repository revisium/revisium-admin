import { Flex, IconButton } from '@chakra-ui/react'
import { Tooltip } from 'src/shared/ui'
import { FC, useCallback } from 'react'
import { PiEyeThin, PiInfo, PiUploadThin } from 'react-icons/pi'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'

interface FilePluginActionsProps {
  store: JsonObjectValueStore
  readonly?: boolean
  onUpload?: (fileId: string, file: File) => void
  dataTestId?: string
  hoverClassName?: string
}

export const FilePluginActions: FC<FilePluginActionsProps> = ({
  hoverClassName,
  readonly,
  store,
  onUpload,
  dataTestId,
}) => {
  const status = (store.value['status'] as JsonStringValueStore).getPlainValue()
  const fileId = (store.value['fileId'] as JsonStringValueStore).getPlainValue()
  const url = (store.value['url'] as JsonStringValueStore).getPlainValue()
  const showViewFile = Boolean(url)
  const showUploadFile = !readonly && (status === 'ready' || status === 'uploaded')
  const showInfo = !showViewFile && !showUploadFile
  const hoverLogic = showViewFile

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    onUpload?.(fileId, file)

    event.target.value = ''
  }

  const handleOpenFile = useCallback(() => {
    window.open(url, '_blank')
  }, [url])

  return (
    <Flex className={hoverLogic ? hoverClassName : undefined} alignItems="center">
      {showInfo && (
        <Tooltip
          openDelay={50}
          closeDelay={50}
          positioning={{ placement: 'right' }}
          content="To upload this file, you must first save this row."
        >
          <Flex width="24px" height="24px" alignItems="center" justifyContent="center" color="gray.400">
            <PiInfo />
          </Flex>
        </Tooltip>
      )}
      {showViewFile && (
        <IconButton
          data-testid={`${dataTestId}-open-file`}
          _hover={{ backgroundColor: 'gray.100' }}
          aria-label=""
          height="24px"
          variant="ghost"
          onClick={handleOpenFile}
          size="sm"
        >
          <PiEyeThin />
        </IconButton>
      )}
      {showUploadFile && (
        <>
          <input type="file" onChange={handleFileChange} id={`file-${fileId}`} style={{ display: 'none' }} />
          <label htmlFor={`file-${fileId}`}>
            <IconButton
              data-testid={`${dataTestId}-upload-file`}
              cursor="pointer"
              _hover={{ backgroundColor: 'gray.100' }}
              aria-label=""
              height="24px"
              variant="ghost"
              as="span"
              size="sm"
            >
              <PiUploadThin />
            </IconButton>
          </label>
        </>
      )}
    </Flex>
  )
}
