import { Box, Flex, Separator, Spacer, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { PiUsersLight, PiHouseLight, PiCaretCircleLeftLight } from 'react-icons/pi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ADMIN_ROUTE, ADMIN_USERS_ROUTE } from 'src/shared/config/routes'
import { AccountButton } from 'src/widgets/AccountButton'

interface AdminHeaderProps {
  onBack: () => void
}

const AdminHeader: FC<AdminHeaderProps> = ({ onBack }) => {
  return (
    <Flex flexDirection="column" alignItems="flex-start" width="100%" minWidth="0">
      <Flex alignItems="center" gap="8px" padding="4px">
        <Box
          fontSize="20px"
          color="newGray.400"
          cursor="pointer"
          _hover={{ color: 'newGray.500' }}
          onClick={onBack}
          display="flex"
          alignItems="center"
          flexShrink={0}
        >
          <PiCaretCircleLeftLight />
        </Box>
        <Box
          color="black"
          fontWeight="600"
          fontSize="18px"
          lineHeight="26px"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
        >
          Admin
        </Box>
      </Flex>
    </Flex>
  )
}

interface NavigationButtonProps {
  to: string
  label: string
  isActive: boolean
  icon: React.ReactNode
}

const NavigationButton: FC<NavigationButtonProps> = ({ to, label, isActive, icon }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
      <Flex
        alignItems="center"
        backgroundColor={isActive ? 'newGray.100' : 'transparent'}
        _hover={{ backgroundColor: 'newGray.100' }}
        borderRadius="8px"
        height="36px"
        paddingX="8px"
        width="100%"
        color={isActive ? 'black' : 'newGray.600'}
        fontWeight="400"
        textDecoration="none"
        fontSize="14px"
        minWidth="0"
        cursor="pointer"
        gap="12px"
        userSelect="none"
      >
        <Box fontSize="20px" color="newGray.400">
          {icon}
        </Box>
        <Box flex="1" minWidth="0" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          {label}
        </Box>
      </Flex>
    </Link>
  )
}

export const AdminSidebar: FC = observer(() => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const isAdminRoot = currentPath === `/${ADMIN_ROUTE}`
  const isUsers = currentPath.startsWith(`/${ADMIN_ROUTE}/${ADMIN_USERS_ROUTE}`)

  const handleBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <VStack alignItems="flex-start" gap={0} width="100%" flex={1}>
      <AdminHeader onBack={handleBack} />

      <Box width="100%" paddingY="16px">
        <Separator borderColor="newGray.100" />
      </Box>

      <Flex flexDirection="column" width="100%" gap={1}>
        <NavigationButton to={`/${ADMIN_ROUTE}`} label="Dashboard" icon={<PiHouseLight />} isActive={isAdminRoot} />
        <NavigationButton
          to={`/${ADMIN_ROUTE}/${ADMIN_USERS_ROUTE}`}
          label="Users"
          icon={<PiUsersLight />}
          isActive={isUsers}
        />
      </Flex>

      <Spacer />

      <Flex flexDirection="column" width="100%" gap={1}>
        <AccountButton />
      </Flex>
    </VStack>
  )
})
