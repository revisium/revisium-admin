import { IconButton } from '@chakra-ui/react'
import React from 'react'
import { PiArrowLeftThin } from 'react-icons/pi'

interface BackButtonProps {
  onClick?: () => void
  dataTestId?: string
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, dataTestId }) => {
  return (
    <IconButton
      data-testid={dataTestId}
      _hover={{ backgroundColor: 'gray.50' }}
      aria-label="back"
      color="gray.400"
      icon={<PiArrowLeftThin />}
      variant="outline"
      onClick={onClick}
    ></IconButton>
  )
}
