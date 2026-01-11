import { Flex, HoverCard, Icon, Portal, Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { PiCloudLight, PiLockSimpleLight } from 'react-icons/pi'

interface VisibilityBadgeProps {
  isPublic: boolean
  roleName: string | null
}

export const VisibilityBadge: FC<VisibilityBadgeProps> = ({ isPublic, roleName }) => {
  return (
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
                    {isPublic ? 'Public — Anyone can view this project' : 'Private — Only invited users can access'}
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
  )
}
