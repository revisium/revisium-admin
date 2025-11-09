import { Box, Flex } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface NavigationButtonProps {
  to: string
  label: string
  isActive: boolean
  icon?: ReactNode
}

export const NavigationButton: FC<NavigationButtonProps> = ({ to, label, isActive, icon }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
      <Flex
        alignItems="center"
        backgroundColor={isActive ? 'newGray.100' : 'transparent'}
        _hover={{ backgroundColor: 'newGray.100', color: 'newGray.600' }}
        borderRadius="0.25rem"
        height="30px"
        paddingLeft="0.5rem"
        paddingRight="0.5rem"
        width="100%"
        color="newGray.500"
        fontWeight="500"
        textDecoration="none"
        fontSize="14px"
        minWidth="0"
        cursor="pointer"
        gap="0.5rem"
      >
        {icon && <Box fontSize="14px">{icon}</Box>}
        {label}
      </Flex>
    </Link>
  )
}
