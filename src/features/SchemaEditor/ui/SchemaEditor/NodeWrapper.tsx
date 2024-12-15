import { Box, Flex } from '@chakra-ui/react'
import React, { PropsWithChildren } from 'react'
import { PiDotOutlineFill } from 'react-icons/pi'

interface NodeWrapperProps {
  field: React.ReactNode
  fieldClassName?: string
}

export const NodeWrapper: React.FC<NodeWrapperProps & PropsWithChildren> = ({ field, fieldClassName, children }) => {
  return (
    <Flex flexDirection="column" alignSelf="flex-start" width="100%">
      <Flex
        gap="4px"
        alignItems="center"
        height="30px"
        mt="2px"
        mb="2px"
        className={fieldClassName}
        position="relative"
      >
        <Box /* For hover */ position="absolute" ml="-200px" height="100%" width="200px" />
        <Box color="gray.300">
          <PiDotOutlineFill />
        </Box>
        {field}
      </Flex>
      {children && (
        <Flex
          ml="7px"
          pl="18px"
          borderLeftWidth={1}
          borderLeftStyle="solid"
          borderLeftColor="white"
          _hover={{
            borderLeftColor: 'blackAlpha.200',
          }}
        >
          {children}
        </Flex>
      )}
    </Flex>
  )
}
