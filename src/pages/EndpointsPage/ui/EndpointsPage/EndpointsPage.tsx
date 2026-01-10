import { Box, Button, Flex, HStack, HoverCard, Icon, Portal, Spinner, Tabs, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { PiInfoLight, PiPlusLight } from 'react-icons/pi'
import { EndpointsPageViewModel, TabType } from 'src/pages/EndpointsPage/model/EndpointsPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page, Tooltip } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'
import { CreateEndpointDialog } from '../CreateEndpointDialog/CreateEndpointDialog.tsx'
import { EndpointTabContent } from '../EndpointTabContent/EndpointTabContent.tsx'
import { SystemApiSection } from '../SystemApiSection/SystemApiSection.tsx'

export const EndpointsPage = observer(() => {
  const model = useViewModel(EndpointsPageViewModel)

  if (model.isLoading) {
    return (
      <Page sidebar={<ProjectSidebar />}>
        <Flex justify="center" align="center" height="200px">
          <Spinner />
        </Flex>
      </Page>
    )
  }

  if (model.isError) {
    return (
      <Page sidebar={<ProjectSidebar />}>
        <Flex justify="center" align="center" height="200px">
          <Text color="red.500">Error loading endpoints</Text>
        </Flex>
      </Page>
    )
  }

  return (
    <Page sidebar={<ProjectSidebar />}>
      <Box mb="4rem">
        <HStack justify="space-between" align="flex-start" mb={1}>
          <Text fontSize="20px" fontWeight="600" color="newGray.500">
            Endpoints
          </Text>
          {model.canCreateEndpoint && (
            <Tooltip content="Create endpoint for a specific revision (not just Draft/Head)">
              <Button size="xs" variant="ghost" color="newGray.400" onClick={model.openCreateDialog}>
                <PiPlusLight />
                Add custom
              </Button>
            </Tooltip>
          )}
        </HStack>
        <HStack gap={1} mb={6}>
          <Text fontSize="xs" color="newGray.400">
            Auto-generated APIs from your table schemas.
          </Text>
          <HoverCard.Root openDelay={200} closeDelay={100}>
            <HoverCard.Trigger>
              <Icon as={PiInfoLight} color="newGray.400" cursor="help" />
            </HoverCard.Trigger>
            <Portal>
              <HoverCard.Positioner>
                <HoverCard.Content maxWidth="360px" p={3}>
                  <HoverCard.Arrow>
                    <HoverCard.ArrowTip />
                  </HoverCard.Arrow>
                  <VStack align="start" gap={3}>
                    <Text fontSize="xs" color="newGray.600">
                      Each branch maintains a history of revisions (commits).
                    </Text>
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="newGray.600">
                        <Text as="span" fontWeight="600">
                          Draft
                        </Text>{' '}
                        — points to the working revision where you make changes.
                      </Text>
                      <Text fontSize="xs" color="newGray.600">
                        <Text as="span" fontWeight="600">
                          Head
                        </Text>{' '}
                        — points to the last committed revision (read-only).
                      </Text>
                    </VStack>
                    <Text fontSize="xs" color="newGray.500">
                      Typical workflow: make changes in Draft, then commit to create a new revision and move Head
                      forward.
                    </Text>
                    <Text fontSize="xs" color="newGray.500">
                      Head updates only after commit (stable for production). Draft reflects changes immediately (good
                      for dev or live sync).
                    </Text>
                    <Text fontSize="xs" color="newGray.500">
                      You can create endpoints for Head, Draft, or any revision in the history.
                    </Text>
                  </VStack>
                </HoverCard.Content>
              </HoverCard.Positioner>
            </Portal>
          </HoverCard.Root>
        </HStack>

        <Tabs.Root
          value={model.selectedTab}
          onValueChange={(e) => model.setSelectedTab(e.value as TabType)}
          variant="line"
        >
          <Tabs.List mb={4}>
            <Tabs.Trigger value="graphql">GraphQL</Tabs.Trigger>
            <Tabs.Trigger value="rest-api">REST API</Tabs.Trigger>
            <Tabs.Trigger value="system-api">System API</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="graphql">
            <EndpointTabContent
              branchSections={model.branchSections}
              customEndpoints={model.customEndpoints}
              hasCustomEndpoints={model.hasCustomEndpoints}
              canDeleteEndpoint={model.canDeleteEndpoint}
              onDeleteEndpoint={model.deleteCustomEndpoint}
            />
          </Tabs.Content>

          <Tabs.Content value="rest-api">
            <EndpointTabContent
              branchSections={model.branchSections}
              customEndpoints={model.customEndpoints}
              hasCustomEndpoints={model.hasCustomEndpoints}
              canDeleteEndpoint={model.canDeleteEndpoint}
              onDeleteEndpoint={model.deleteCustomEndpoint}
            />
          </Tabs.Content>

          <Tabs.Content value="system-api">
            <SystemApiSection model={model.systemApi} />
          </Tabs.Content>
        </Tabs.Root>
      </Box>

      {model.createDialog && <CreateEndpointDialog model={model.createDialog} />}
    </Page>
  )
})
