import { Center, Text } from '@chakra-ui/react'
import { FC } from 'react'

export const Empty: FC = () => {
  return (
    <Center height="200px">
      <Text color="gray.500" fontSize="sm">
        No revisions found
      </Text>
    </Center>
  )
}
