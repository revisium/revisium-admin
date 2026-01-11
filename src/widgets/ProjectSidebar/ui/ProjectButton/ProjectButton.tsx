import { Box, Flex, HoverCard, Icon, Portal, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiCaretCircleLeftLight, PiCloudLight, PiLockSimpleLight } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

interface ProjectHeaderProps {
  name: string
  organizationName: string
  isPublic: boolean
  roleName: string | null
}

export const ProjectHeader: FC<ProjectHeaderProps> = observer(({ name, organizationName, isPublic, roleName }) => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <Flex flexDirection="column" alignItems="flex-start" width="100%" minWidth="0">
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
        <Flex alignItems="center" gap="4px" minWidth={0} flex={1}>
          <Box
            color="black"
            fontWeight="600"
            fontSize="18px"
            lineHeight="26px"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
          >
            {name}
          </Box>
          <HoverCard.Root openDelay={200} closeDelay={100}>
            <HoverCard.Trigger>
              <Icon fontSize="14px" color="newGray.400" flexShrink={0}>
                {isPublic ? <PiCloudLight /> : <PiLockSimpleLight />}
              </Icon>
            </HoverCard.Trigger>
            <Portal>
              <HoverCard.Positioner>
                <HoverCard.Content maxWidth="280px" p={3}>
                  <HoverCard.Arrow>
                    <HoverCard.ArrowTip />
                  </HoverCard.Arrow>
                  <VStack align="start" gap={3}>
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="newGray.600" fontWeight="600">
                        Project visibility
                      </Text>
                      <Flex align="center" gap={2}>
                        <Icon fontSize="14px" color="newGray.500" flexShrink={0}>
                          {isPublic ? <PiCloudLight /> : <PiLockSimpleLight />}
                        </Icon>
                        <Text fontSize="xs" color="newGray.500">
                          {isPublic
                            ? 'Public — Anyone can view this project'
                            : 'Private — Only invited users can access'}
                        </Text>
                      </Flex>
                    </VStack>
                    {roleName && (
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="newGray.600" fontWeight="600">
                          Your role
                        </Text>
                        <Text fontSize="xs" color="newGray.500">
                          {roleName}
                        </Text>
                      </VStack>
                    )}
                  </VStack>
                </HoverCard.Content>
              </HoverCard.Positioner>
            </Portal>
          </HoverCard.Root>
        </Flex>
      </Flex>
      <Flex
        color="newGray.400"
        fontWeight="500"
        fontSize="14px"
        lineHeight="20px"
        padding="4px"
        alignItems="center"
        width="100%"
        minWidth={0}
      >
        <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          {organizationName}
        </Box>
      </Flex>
    </Flex>
  )
})
