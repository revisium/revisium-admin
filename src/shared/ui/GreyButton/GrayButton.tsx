import { Box, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'

interface GrayButtonProps {
  title: string
  onClick?: () => void
  disabled?: boolean
  isSelected?: boolean
  isLoading?: boolean
  icon?: React.ReactNode
  height?: string
  dataTestId?: string
}

export const GrayButton: React.FC<GrayButtonProps> = ({
  height = '2.5rem',
  title,
  onClick,
  disabled,
  isSelected,
  isLoading,
  icon,
  dataTestId,
}) => {
  return (
    <Button
      data-testid={dataTestId}
      _hover={{ color: 'gray.400', backgroundColor: 'white' }}
      _disabled={isSelected ? { backgroundColor: 'gray.50', cursor: 'not-allowed' } : undefined}
      alignSelf="flex-start"
      color="gray.300"
      fontWeight="500"
      fontSize={16}
      height={height}
      disabled={disabled || isSelected}
      loading={isLoading}
      variant="ghost"
      onClick={onClick}
    >
      <Flex alignItems="center" gap="0.5rem">
        {icon && <Box fontSize="sm">{icon}</Box>}
        <Text>{title}</Text>
      </Flex>
    </Button>
  )
}
