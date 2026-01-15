import { Box, HStack, Text } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'

interface DetailRowProps {
  label: string
  value: ReactNode
}

export const DetailRow: FC<DetailRowProps> = ({ label, value }) => {
  if (!value) {
    return null
  }
  return (
    <HStack justify="space-between" width="100%">
      <Text color="fg.muted" fontSize="sm">
        {label}
      </Text>
      <Box fontSize="sm" fontWeight="medium">
        {value}
      </Box>
    </HStack>
  )
}
