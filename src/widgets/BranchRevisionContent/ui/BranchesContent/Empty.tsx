import { Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'

export const Empty: FC = () => {
  return (
    <VStack justify="center" align="center" height="100%" gap={4} p={4}>
      <Text fontSize="sm" color="gray.500" textAlign="center">
        No branches found in this project
      </Text>
    </VStack>
  )
}
