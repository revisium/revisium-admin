import { CopyIcon } from '@chakra-ui/icons'
import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { FC } from 'react'

interface CopyButtonProps extends IconButtonProps {
  dataTestId?: string
}

export const CopyButton: FC<CopyButtonProps> = ({ dataTestId, ...props }) => {
  return (
    <IconButton
      data-testid={dataTestId}
      _hover={{ backgroundColor: 'gray.100' }}
      color="gray.400"
      icon={<CopyIcon />}
      variant="ghost"
      {...props}
    />
  )
}
