import { Box, Flex, Spacer } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiCaretCircleLeftLight } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { SidebarToggleButton } from 'src/shared/ui'

interface OrganizationHeaderProps {
  organizationId: string
}

export const OrganizationHeader: FC<OrganizationHeaderProps> = observer(({ organizationId }) => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <Flex className="group" flexDirection="column" alignItems="flex-start" width="100%" minWidth="0">
      <Flex alignItems="center" gap="8px" padding="4px" width="100%" minWidth={0}>
        <Box
          fontSize="20px"
          color="newGray.400"
          cursor="pointer"
          _hover={{ color: 'newGray.500' }}
          onClick={handleBackClick}
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
          flex={1}
          minWidth={0}
        >
          {organizationId}
        </Box>
        <Spacer />
        <SidebarToggleButton />
      </Flex>
    </Flex>
  )
})
