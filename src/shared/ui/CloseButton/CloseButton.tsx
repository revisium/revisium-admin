import { CloseIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import React from 'react'

interface CloseButtonProps {
  onClick?: () => void
  isDisabled?: boolean
  height?: string
  dataTestId?: string
}

export const CloseButton: React.FC<CloseButtonProps> = ({ height = '2.5rem', onClick, isDisabled, dataTestId }) => {
  return (
    <Button
      data-testid={dataTestId}
      isDisabled={isDisabled}
      _hover={{ backgroundColor: 'gray.50' }}
      alignSelf="flex-start"
      color="gray.400"
      height={height}
      variant="ghost"
      onClick={onClick}
      width="48px"
    >
      <CloseIcon boxSize={3} />
    </Button>
  )
}
