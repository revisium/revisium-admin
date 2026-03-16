import { Flex, Link as ChakraLink, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { PiWarningThin } from 'react-icons/pi'
import { Link } from 'react-router-dom'

export const NotFoundProjectPage: FC = () => {
  return (
    <Flex alignItems="center" flex={1} gap="1rem" justifyContent="center" width="100%" height="100%" direction="column">
      <PiWarningThin size={32} color="gray" />
      <Text color="gray.400">Project not found</Text>
      <Link to="/">
        <ChakraLink fontSize="sm">Go to home</ChakraLink>
      </Link>
    </Flex>
  )
}
