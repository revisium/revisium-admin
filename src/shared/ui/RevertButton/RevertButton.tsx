import { IconButton } from '@chakra-ui/react'
import React from 'react'
import { PiArrowCounterClockwiseBold } from 'react-icons/pi'

interface RevertButtonProps {
  onClick?: () => void
  isDisabled?: boolean
  dataTestId?: string
}

export const RevertButton: React.FC<RevertButtonProps> = ({ onClick, isDisabled, dataTestId }) => {
  return (
    <IconButton
      data-testid={dataTestId}
      disabled={isDisabled}
      _hover={{ backgroundColor: 'gray.50' }}
      alignSelf="flex-start"
      color="gray.400"
      height="2.5rem"
      variant="ghost"
      onClick={onClick}
      width="48px"
      size="sm"
    >
      <PiArrowCounterClockwiseBold />
    </IconButton>
  )
}
