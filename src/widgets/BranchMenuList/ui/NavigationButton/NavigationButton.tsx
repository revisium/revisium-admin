import { Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { Link } from 'react-router-dom'

interface NavigationButtonProps {
  to: string
  label: string
  isActive: boolean
}

export const NavigationButton: FC<NavigationButtonProps> = ({ to, label, isActive }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
      <Flex
        alignItems="center"
        backgroundColor={isActive ? 'newGray.100' : 'transparent'}
        _hover={{ backgroundColor: 'newGray.100' }}
        borderRadius="0.25rem"
        height="30px"
        paddingLeft="0.5rem"
        paddingRight="0.5rem"
        width="100%"
      >
        <Text fontSize="sm" color="gray.700" fontWeight={isActive ? 'medium' : 'normal'}>
          {label}
        </Text>
      </Flex>
    </Link>
  )
}
