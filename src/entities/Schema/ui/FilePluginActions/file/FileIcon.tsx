import { IconButton } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { PiFile } from 'react-icons/pi'

interface FileIconProps {
  dataTestId: string
  url: string
}

export const FileIcon: FC<FileIconProps> = ({ dataTestId, url }) => {
  const handleOpenFile = useCallback(() => {
    window.open(url, '_blank')
  }, [url])

  return (
    <IconButton
      data-testid={`${dataTestId}-open-file`}
      _hover={{ backgroundColor: 'gray.100', color: 'black' }}
      color="gray.400"
      aria-label=""
      height="24px"
      variant="ghost"
      onClick={handleOpenFile}
      size="sm"
    >
      <PiFile />
    </IconButton>
  )
}
