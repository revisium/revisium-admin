import { Button, Icon } from '@chakra-ui/react'
import React from 'react'
import { PiX } from 'react-icons/pi'

interface CloseButtonProps {
  onClick?: () => void
  disabled?: boolean
  height?: string
  dataTestId?: string
}

export const CloseButton: React.FC<CloseButtonProps> = ({ height = '2.5rem', onClick, disabled, dataTestId }) => {
  return (
    <Button
      data-testid={dataTestId}
      disabled={disabled}
      _hover={{ backgroundColor: 'gray.50' }}
      alignSelf="flex-start"
      color="gray.400"
      height={height}
      variant="ghost"
      onClick={onClick}
      width="48px"
    >
      <Icon size="md">
        <PiX />
      </Icon>
    </Button>
  )
}
