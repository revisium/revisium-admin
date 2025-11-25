import { Box, Flex } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface NavigationButtonProps {
  to?: string
  label: string
  isActive: boolean
  icon?: ReactNode
  onClick?: () => void
  badge?: number | null
}

export const NavigationButton: FC<NavigationButtonProps> = ({ to, label, isActive, icon, onClick, badge }) => {
  const content = (
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
      onClick={onClick}
    >
      {icon && <Box fontSize="14px">{icon}</Box>}
      <Box flex="1" minWidth="0" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
        {label}
      </Box>
      {badge !== null && badge !== undefined && badge > 0 && (
        <Box
          fontSize="11px"
          fontWeight="600"
          color="newGray.400"
          backgroundColor="newGray.100"
          borderRadius="0.25rem"
          paddingX="0.375rem"
          paddingY="0.125rem"
          minWidth="1.25rem"
          textAlign="center"
        >
          {badge > 99 ? '99+' : badge}
        </Box>
      )}
    </Flex>
  )

  if (to && !onClick) {
    return (
      <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
        {content}
      </Link>
    )
  }

  return content
}
