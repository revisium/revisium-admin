import { Box, Flex, Popover } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'

interface BranchTriggerProps {
  name: ReactNode
  postfix: ReactNode
  touched?: boolean
}

export const BranchTrigger: FC<BranchTriggerProps> = ({ name, postfix, touched }) => {
  return (
    <Popover.Trigger asChild>
      <Flex
        color="newGray.500"
        _hover={{ color: 'newGray.600' }}
        fontWeight="500"
        textDecoration="none"
        fontSize="16px"
        alignItems="center"
        minWidth="0"
      >
        <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          {name}
        </Box>
        <Box color="newGray.300" flexShrink="0">
          {postfix}
        </Box>
        {touched && <Box flexShrink="0">*</Box>}
      </Flex>
    </Popover.Trigger>
  )
}
