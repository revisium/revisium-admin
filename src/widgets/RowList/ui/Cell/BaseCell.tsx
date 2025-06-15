import { Box, Text } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

export const BaseCell: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box alignItems="center" minHeight="40px" as="td" borderRightWidth="1px" borderColor="gray.100">
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
    </Box>
  )
}
