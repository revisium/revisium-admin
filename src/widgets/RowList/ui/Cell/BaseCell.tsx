import { Box, Text } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

interface BaseCellProps extends PropsWithChildren {
  isLastCell: boolean
}

export const BaseCell: FC<BaseCellProps> = ({ isLastCell, children }) => {
  return (
    <Box
      minHeight="40px"
      as="td"
      {...(isLastCell ? {} : { borderRightWidth: '1px', borderColor: 'gray.100' })}
      overflow="hidden"
      maxWidth="0"
      pl="16px"
      pr="16px"
    >
      <Text
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        color="black"
        _hover={{ color: 'black' }}
        fontWeight="300"
      >
        {children}
      </Text>
    </Box>
  )
}
