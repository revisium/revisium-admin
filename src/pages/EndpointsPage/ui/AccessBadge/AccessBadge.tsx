import { Badge, HoverCard, Icon, Link as ChakraLink, Portal, Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { PiArrowRightLight, PiCloudLight, PiLockSimpleLight } from 'react-icons/pi'
import { Link as RouterLink } from 'react-router-dom'

interface AccessBadgeProps {
  isPublic: boolean
  canUpdateProject: boolean
  settingsLink: string
}

export const AccessBadge: FC<AccessBadgeProps> = ({ isPublic, canUpdateProject, settingsLink }) => {
  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger>
        <Badge variant="subtle" colorPalette="gray" cursor="help" display="inline-flex" alignItems="center" gap={1}>
          <Icon as={isPublic ? PiCloudLight : PiLockSimpleLight} />
          {isPublic ? 'Public' : 'Private'}
        </Badge>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content maxWidth="320px" p={3}>
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            <VStack align="start" gap={3}>
              <Text fontSize="xs" fontWeight="600" color="newGray.600">
                {isPublic ? 'Public Project' : 'Private Project'}
              </Text>
              {isPublic ? (
                <VStack align="start" gap={1}>
                  <Text fontSize="xs" color="newGray.600">
                    <Text as="span" fontWeight="600">
                      Read operations
                    </Text>{' '}
                    — no authentication required
                  </Text>
                  <Text fontSize="xs" color="newGray.600">
                    <Text as="span" fontWeight="600">
                      Write operations
                    </Text>{' '}
                    — authentication required
                  </Text>
                </VStack>
              ) : (
                <Text fontSize="xs" color="newGray.600">
                  All operations require authentication.
                </Text>
              )}
              {canUpdateProject ? (
                <ChakraLink asChild fontSize="xs" color="gray.500">
                  <RouterLink to={settingsLink}>
                    Change in Settings
                    <Icon as={PiArrowRightLight} ml={1} />
                  </RouterLink>
                </ChakraLink>
              ) : (
                <Text fontSize="xs" color="gray.400" fontStyle="italic">
                  Only project admins can change visibility
                </Text>
              )}
            </VStack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
}
