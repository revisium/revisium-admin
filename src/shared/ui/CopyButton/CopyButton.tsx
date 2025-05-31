import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { FC } from 'react'
import { PiCopyThin } from 'react-icons/pi'

interface CopyButtonProps extends IconButtonProps {
  dataTestId?: string
}

export const CopyButton: FC<CopyButtonProps> = ({ dataTestId, ...props }) => {
  return (
    <IconButton
      data-testid={dataTestId}
      _hover={{ backgroundColor: 'gray.100' }}
      color="gray.400"
      variant="ghost"
      {...props}
    >
      <PiCopyThin />
    </IconButton>
  )
}
