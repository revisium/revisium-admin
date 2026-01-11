import { Box, HoverCard, HStack, Icon, Portal, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiInfoLight } from 'react-icons/pi'

interface ProjectGraphHeaderProps {
  projectName: string
  branchesCount: number
  endpointsCount: number
}

export const ProjectGraphHeader: FC<ProjectGraphHeaderProps> = observer(
  ({ projectName, branchesCount, endpointsCount }) => {
    return (
      <Box mb={6} position="sticky" top={0} bg="white" zIndex={10} pt={4} pb={2}>
        <HStack justify="space-between" align="flex-start" mb={1}>
          <Text fontSize="20px" fontWeight="600" color="newGray.500">
            Branch Map for {projectName} ({branchesCount} branches, {endpointsCount} endpoints)
          </Text>
        </HStack>

        <HStack gap={1} mb={4}>
          <Text fontSize="xs" color="newGray.400">
            Visual overview of branches, revisions, and API endpoints in your project.
          </Text>
          <HoverCard.Root openDelay={200} closeDelay={100}>
            <HoverCard.Trigger>
              <Icon as={PiInfoLight} color="newGray.400" cursor="help" />
            </HoverCard.Trigger>
            <Portal>
              <HoverCard.Positioner>
                <HoverCard.Content maxWidth="400px" p={3}>
                  <HoverCard.Arrow>
                    <HoverCard.ArrowTip />
                  </HoverCard.Arrow>
                  <VStack align="start" gap={3}>
                    <Text fontSize="xs" color="newGray.600" fontWeight="600">
                      About Branch Map
                    </Text>
                    <Text fontSize="xs" color="newGray.600">
                      This graph shows the structure of your project: branches, their revisions, and connected API
                      endpoints.
                    </Text>
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="newGray.500" fontWeight="500">
                        Interactions:
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Hover over a node to highlight its connections
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Click on a node to open branch, revision, or endpoints page
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Use mouse wheel to zoom, drag to pan
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Use fullscreen button for larger view
                      </Text>
                    </VStack>
                  </VStack>
                </HoverCard.Content>
              </HoverCard.Positioner>
            </Portal>
          </HoverCard.Root>
        </HStack>
      </Box>
    )
  },
)
