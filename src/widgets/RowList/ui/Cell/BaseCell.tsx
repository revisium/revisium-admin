import { Flex, Text } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

interface CellProps {
  width?: string
}

export const BaseCell: FC<CellProps & PropsWithChildren> = ({ width, children }) => {
  return (
    <Flex alignItems="center" minHeight="40px" minWidth={width} width={width} as="td">
      <Text
        ml="16px"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        color="gray.400"
        _hover={{ color: 'black' }}
        fontWeight="300"
      >
        {children}
      </Text>
    </Flex>
  )
}
