import { Flex, Text, Link as ChakraLink } from '@chakra-ui/react'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { LOGIN_ROUTE } from 'src/shared/config/routes.ts'
import { Page } from 'src/shared/ui'

export const SignUpCompletedPage: FC = () => {
  return (
    <Page hideSidebar>
      <Flex alignItems="center" flexDirection="column" justifyContent="center" flex={1} gap="8px">
        <Text color="gray.400">Check your email to confirm your account</Text>
        <ChakraLink color="gray.400" alignSelf="center" as={Link} to={`/${LOGIN_ROUTE}`}>
          Log in
        </ChakraLink>
      </Flex>
    </Page>
  )
}
