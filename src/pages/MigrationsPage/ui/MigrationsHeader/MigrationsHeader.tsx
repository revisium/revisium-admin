import { Box, Button, Flex, HoverCard, HStack, Icon, Link, Menu, Portal, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiCaretDownLight, PiInfoLight } from 'react-icons/pi'
import { ViewMode } from 'src/pages/MigrationsPage/config/viewMode.ts'
import { MigrationsViewSwitcher } from 'src/pages/MigrationsPage/ui/MigrationsViewSwitcher/MigrationsViewSwitcher.tsx'

interface MigrationsHeaderProps {
  totalCount: number
  branchName: string
  viewMode: ViewMode
  canApplyMigrations: boolean
  onViewModeChange: (mode: ViewMode) => void
  onApplyFromJson: () => void
  onApplyFromBranch: () => void
}

export const MigrationsHeader: FC<MigrationsHeaderProps> = observer(
  ({ totalCount, branchName, viewMode, canApplyMigrations, onViewModeChange, onApplyFromJson, onApplyFromBranch }) => {
    return (
      <Box mb={6} position="sticky" top={0} bg="white" zIndex={10} pt={4} pb={2}>
        <HStack justify="space-between" align="flex-start" mb={1}>
          <Text fontSize="20px" fontWeight="600" color="newGray.500">
            Migrations for {branchName} ({totalCount} operations)
          </Text>
          {canApplyMigrations && (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button size="xs" variant="ghost" color="newGray.400">
                  Apply
                  <PiCaretDownLight />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="json" onClick={onApplyFromJson}>
                      From JSON
                    </Menu.Item>
                    <Menu.Item value="branch" onClick={onApplyFromBranch}>
                      From Branch
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </HStack>

        <HStack gap={1} mb={4}>
          <Text fontSize="xs" color="newGray.400">
            You can use Apply to merge schemas from other branches or import from external sources.
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
                      About Migrations
                    </Text>
                    <Text fontSize="xs" color="newGray.600">
                      Schema changes are tracked as migrations that can be applied to synchronize schemas across
                      branches and environments.
                    </Text>
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="newGray.500" fontWeight="500">
                        Recommended workflows:
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Edit schemas in feature branches, then apply to default
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Use default branch as read-only for schema, merge from others
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Export/import JSON between projects or instances
                      </Text>
                    </VStack>
                    <Box p={2} bg="orange.50" borderRadius="sm">
                      <Text fontSize="xs" color="orange.600">
                        Conflict resolution is not yet supported. Avoid parallel schema changes in multiple branches.
                      </Text>
                    </Box>
                    <Flex gap={1} align="center">
                      <Text fontSize="xs" color="newGray.400">
                        For CI/CD automation, use
                      </Text>
                      <Link
                        href="https://github.com/revisium/revisium-cli"
                        target="_blank"
                        rel="noopener noreferrer"
                        fontSize="xs"
                        color="blue.500"
                      >
                        revisium-cli
                      </Link>
                    </Flex>
                  </VStack>
                </HoverCard.Content>
              </HoverCard.Positioner>
            </Portal>
          </HoverCard.Root>
        </HStack>

        <HStack justify="flex-end">
          <MigrationsViewSwitcher mode={viewMode} onChange={onViewModeChange} />
        </HStack>
      </Box>
    )
  },
)
