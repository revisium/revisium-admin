import { Button } from '@chakra-ui/react'
import React from 'react'
import { PiCaretLeftThin } from 'react-icons/pi'

interface BackButton2Props {
  onClick?: () => void
  isDisabled?: boolean
  height?: string
  dataTestId?: string
}

export const BackButton2: React.FC<BackButton2Props> = ({ height = '2.5rem', onClick, isDisabled, dataTestId }) => {
  return (
    <Button
      data-testid={dataTestId}
      disabled={isDisabled}
      _hover={{ backgroundColor: 'gray.50' }}
      alignSelf="flex-start"
      height={height}
      variant="ghost"
      onClick={onClick}
    >
      <PiCaretLeftThin />
    </Button>
  )
}
