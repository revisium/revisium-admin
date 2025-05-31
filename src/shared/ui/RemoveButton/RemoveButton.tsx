import { IconButtonProps } from '@chakra-ui/react'
import { PiTrashThin } from 'react-icons/pi'
import { IconButton } from '@chakra-ui/react'
import { FC } from 'react'

interface RemoveButtonProps extends IconButtonProps {
  dataTestId?: string
}

export const RemoveButton: FC<RemoveButtonProps> = ({ dataTestId, ...props }) => {
  return (
    <IconButton
      data-testid={dataTestId}
      _hover={{ backgroundColor: 'gray.50' }}
      color="gray.400"
      variant="ghost"
      {...props}
    >
      <PiTrashThin />
    </IconButton>
  )
}
