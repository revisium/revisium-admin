import { Box, Flex, Link as ChakraLink } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import React from 'react'
import { LOGOUT_ROUTE } from 'src/shared/config/routes.ts'

interface PageProps {
  sidebar?: React.ReactElement
  title?: React.ReactElement
  actions?: React.ReactElement
  hideSidebar?: boolean
}

export const Page: React.FC<PageProps & React.PropsWithChildren> = ({
  hideSidebar,
  sidebar,
  title,
  actions,
  children,
}) => {
  return (
    <Flex minHeight="100vh">
      {!hideSidebar && (
        <Flex
          backgroundColor="gray.50"
          borderRight="1px solid"
          borderRightColor="gray.200"
          flexDirection="column"
          justifyContent={sidebar ? 'space-between' : 'flex-end'}
          padding="1rem"
          width="250px"
          height="100vh"
          top={0}
          position="sticky"
        >
          <Box>{sidebar}</Box>
          <ChakraLink color="gray.400" alignSelf="center" as={Link} to={`/${LOGOUT_ROUTE}`}>
            Logout
          </ChakraLink>
        </Flex>
      )}

      <Flex alignItems="center" flex={1} flexDirection="column" width="100%">
        {(title || actions) && (
          <Flex
            alignItems="center"
            backgroundColor="white"
            borderBottom="1px solid"
            borderBottomColor="gray.50"
            justifyContent="space-between"
            maxWidth="900px"
            padding="8px"
            width="100%"
            position="sticky"
            zIndex={1}
            top={0}
          >
            {title}
            {actions}
          </Flex>
        )}

        <Flex flex={1} flexDirection="column" maxWidth="900px" padding="1rem 1rem 0rem 1rem" width="100%">
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}
