import { CheckIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import React from 'react'

interface ApproveButtonProps {
  loading?: boolean
  isDisabled?: boolean
  onClick?: () => void
  title?: string
  height?: string
  dataTestId?: string
}

export const ApproveButton: React.FC<ApproveButtonProps> = ({
  height = '2.5rem',
  loading,
  isDisabled,
  onClick,
  title,
  dataTestId,
}) => {
  return (
    <Button
      data-testid={dataTestId}
      _hover={{ backgroundColor: 'gray.50' }}
      alignSelf="flex-start"
      color="gray.400"
      height={height}
      isLoading={loading}
      isDisabled={isDisabled}
      variant="ghost"
      onClick={onClick}
      width="48px"
    >
      <CheckIcon boxSize={3} mr={title ? 2 : 0} />
      {title}
    </Button>
  )
}
