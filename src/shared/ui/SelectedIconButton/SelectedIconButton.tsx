import { Button } from '@chakra-ui/react'
import React from 'react'

interface SelectedIconButtonProps {
  isSelected?: boolean
  onClick?: () => void
  icon: React.ReactNode
  dataTestId?: string
}

export const SelectedIconButton: React.FC<SelectedIconButtonProps> = ({ isSelected, onClick, icon, dataTestId }) => {
  return (
    <Button
      data-testid={dataTestId}
      _disabled={isSelected ? { backgroundColor: 'gray.50', cursor: 'not-allowed' } : undefined}
      _hover={{ backgroundColor: 'gray.50' }}
      disabled={isSelected}
      alignSelf="flex-start"
      variant="ghost"
      onClick={onClick}
      width="48px"
    >
      {icon}
    </Button>
  )
}
