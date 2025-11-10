import { IconButton } from '@chakra-ui/react'
import React from 'react'

interface SelectedIconButtonProps {
  isSelected?: boolean
  onClick?: () => void
  icon: React.ReactNode
  dataTestId?: string
}

export const SelectedIconButton: React.FC<SelectedIconButtonProps> = ({ isSelected, onClick, icon, dataTestId }) => {
  return (
    <IconButton
      data-testid={dataTestId}
      _disabled={isSelected ? { backgroundColor: 'newGray.100', cursor: 'not-allowed' } : undefined}
      _hover={{ backgroundColor: 'gray.50' }}
      disabled={isSelected}
      alignSelf="flex-start"
      variant="ghost"
      onClick={onClick}
      width="48px"
      size="sm"
    >
      {icon}
    </IconButton>
  )
}
