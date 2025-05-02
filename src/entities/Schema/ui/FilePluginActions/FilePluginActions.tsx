import { Flex, IconButton } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { PiEyeThin, PiUploadThin } from 'react-icons/pi'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'

interface FilePluginActionsProps {
  store: JsonObjectValueStore
  onUpload?: (fileId: string, file: File) => void
}

export const FilePluginActions: FC<FilePluginActionsProps> = ({ store, onUpload }) => {
  const fileId = (store.value['fileId'] as JsonStringValueStore).getPlainValue()
  const url = (store.value['url'] as JsonStringValueStore).getPlainValue()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    onUpload?.(fileId, file)
  }

  const handleOpenFile = useCallback(() => {
    window.open(url, '_blank')
  }, [])

  return (
    <Flex>
      <IconButton
        // data-testid={`${dataTestId}-view-foreign-key`}
        _hover={{ backgroundColor: 'gray.100' }}
        aria-label=""
        height="24px"
        icon={<PiEyeThin />}
        variant="ghost"
        onClick={handleOpenFile}
        // className={styles.SelectForeignKeyButton}
      />
      <input type="file" onChange={handleFileChange} id={`file-${fileId}`} style={{ display: 'none' }} />
      <IconButton
        as="label"
        htmlFor={`file-${fileId}`}
        cursor="pointer"
        _hover={{ backgroundColor: 'gray.100' }}
        aria-label=""
        height="24px"
        icon={<PiUploadThin />}
        variant="ghost"
        // className={styles.SelectForeignKeyButton}
      />
    </Flex>
  )
}
