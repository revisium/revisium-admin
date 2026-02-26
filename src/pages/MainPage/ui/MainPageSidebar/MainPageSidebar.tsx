import { Box, Flex, Separator, Spacer, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiGearLight, PiGithubLogoLight, PiGlobeLight } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { ADMIN_ROUTE } from 'src/shared/config/routes'
import { useViewModel } from 'src/shared/lib'
import { SidebarToggleButton } from 'src/shared/ui'
import { AccountButton } from 'src/widgets/AccountButton'
import { MainPageViewModel } from '../../model/MainPageViewModel'

const SidebarHeader: FC = () => {
  return (
    <Flex className="group" flexDirection="column" alignItems="flex-start" width="100%" minWidth="0">
      <Flex alignItems="center" gap="8px" padding="4px" width="100%">
        <Text color="newGray.400" fontWeight="600" fontSize="18px" lineHeight="26px">
          Revisium
        </Text>
        <Flex gap="4px">
          <a href="https://revisium.io" target="_blank" rel="noopener noreferrer">
            <Flex
              fontSize="16px"
              color="newGray.400"
              _hover={{ color: 'newGray.600' }}
              cursor="pointer"
              alignItems="center"
            >
              <PiGlobeLight />
            </Flex>
          </a>
          <a href="https://github.com/revisium/revisium" target="_blank" rel="noopener noreferrer">
            <Flex
              fontSize="16px"
              color="newGray.400"
              _hover={{ color: 'newGray.600' }}
              cursor="pointer"
              alignItems="center"
            >
              <PiGithubLogoLight />
            </Flex>
          </a>
        </Flex>
        <Spacer />
        <SidebarToggleButton />
      </Flex>
    </Flex>
  )
}

export const MainPageSidebar: FC = observer(() => {
  const model = useViewModel(MainPageViewModel)

  return (
    <VStack alignItems="flex-start" gap={0} width="100%" flex={1}>
      <SidebarHeader />

      <Box width="100%" paddingY="16px">
        <Separator borderColor="newGray.100" />
      </Box>

      {model.canAccessAdmin && (
        <Flex flexDirection="column" width="100%" gap={1}>
          <Link to={`/${ADMIN_ROUTE}`} style={{ textDecoration: 'none', width: '100%' }}>
            <Flex
              alignItems="center"
              backgroundColor="transparent"
              _hover={{ backgroundColor: 'newGray.100' }}
              borderRadius="8px"
              height="36px"
              paddingX="8px"
              width="100%"
              color="newGray.600"
              fontWeight="400"
              textDecoration="none"
              fontSize="14px"
              minWidth="0"
              cursor="pointer"
              gap="12px"
              userSelect="none"
            >
              <Box fontSize="20px" color="newGray.400">
                <PiGearLight />
              </Box>
              <Box flex="1" minWidth="0" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                Admin
              </Box>
            </Flex>
          </Link>
        </Flex>
      )}

      <Spacer />

      <Flex flexDirection="column" width="100%" gap={1}>
        <AccountButton />
      </Flex>
    </VStack>
  )
})
