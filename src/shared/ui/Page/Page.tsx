import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

interface PageProps {
  sidebar?: React.ReactElement
  title?: React.ReactElement
  actions?: React.ReactElement
  hideSidebar?: boolean
  footer?: React.ReactElement
}

export const Page: React.FC<PageProps & React.PropsWithChildren> = ({
  hideSidebar,
  sidebar,
  title,
  actions,
  children,
  footer,
}) => {
  return (
    <Flex minHeight="100vh">
      {!hideSidebar && (
        <Flex
          borderRight="1px solid"
          borderRightColor="newGray.100"
          flexDirection="column"
          justifyContent={sidebar ? 'space-between' : 'flex-end'}
          padding="16px"
          width="288px"
          minWidth="288px"
          flexShrink={0}
          height="100vh"
          top={0}
          position="sticky"
        >
          {sidebar}
          {footer && (
            <Box alignSelf="center" mt="1rem">
              {footer}
            </Box>
          )}
        </Flex>
      )}

      <Flex flex={1} minWidth={0} flexDirection="column" alignItems="center">
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
