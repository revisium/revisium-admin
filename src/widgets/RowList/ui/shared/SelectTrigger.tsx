import { Box, Text } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'
import { LuChevronDown } from 'react-icons/lu'

interface SelectTriggerProps {
  children: ReactNode
  icon?: ReactNode
  minWidth?: string
  placeholder?: string
  compact?: boolean
}

export const SelectTrigger: FC<SelectTriggerProps> = ({
  children,
  icon,
  minWidth = '100px',
  placeholder,
  compact = false,
}) => {
  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      gap={1}
      px={2}
      py={compact ? 0.5 : 1}
      borderRadius="md"
      bg="newGray.100"
      _hover={{ bg: 'newGray.200' }}
      cursor="pointer"
      minWidth={minWidth}
    >
      {icon && (
        <Box fontSize="xs" fontFamily="mono" color="newGray.400">
          {icon}
        </Box>
      )}
      <Text fontSize="sm" fontWeight="medium" color="newGray.700" truncate flex={1} textAlign="left">
        {children || placeholder || 'Select'}
      </Text>
      <Box color="newGray.400">
        <LuChevronDown size={compact ? 12 : 14} />
      </Box>
    </Box>
  )
}
