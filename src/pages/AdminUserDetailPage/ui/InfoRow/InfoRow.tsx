import { Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'

interface InfoRowProps {
  label: string
  value: string | null
}

export const InfoRow: FC<InfoRowProps> = ({ label, value }) => {
  return (
    <Flex gap="16px" alignItems="baseline">
      <Text fontSize="xs" color="newGray.400" minWidth="80px">
        {label}
      </Text>
      <Text fontSize="sm" color="newGray.600">
        {value || '-'}
      </Text>
    </Flex>
  )
}
