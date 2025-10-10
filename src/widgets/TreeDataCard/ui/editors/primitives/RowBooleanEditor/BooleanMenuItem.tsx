import { Box } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'

interface BooleanMenuItemProps {
  children: ReactNode
  onClick?: () => void
}

export const BooleanMenuItem: FC<BooleanMenuItemProps> = ({ children, onClick }) => {
  return (
    <Box px={2} py={1.5} cursor="pointer" borderRadius="md" fontSize="sm" _hover={{ bg: 'gray.100' }} onClick={onClick}>
      {children}
    </Box>
  )
}
