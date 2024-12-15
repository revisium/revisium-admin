import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { PiWarningThin } from 'react-icons/pi'

interface NotFoundWrapperProps {
  isEmpty: boolean
  text: string
  children: React.ReactNode
}

export const NotFoundWrapper: React.FC<NotFoundWrapperProps> = ({ isEmpty, text, children }) => {
  return isEmpty ? (
    <Flex alignItems="center" flex={1} gap="1rem" justifyContent="center" width="100%">
      <PiWarningThin color="gray" />
      <Text color="gray.400">{text}</Text>
    </Flex>
  ) : (
    <>{children}</>
  )
}
