import { PiCheckBold } from 'react-icons/pi'
import { Button, Icon } from '@chakra-ui/react'
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
      loading={loading}
      disabled={isDisabled}
      variant="ghost"
      onClick={onClick}
      width="48px"
    >
      <Icon size="sm" mr={title ? 8 : 0}>
        <PiCheckBold />
      </Icon>
      {title}
    </Button>
  )
}
