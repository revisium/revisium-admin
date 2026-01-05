import { Box, Flex, Spinner, Text, Button, HStack, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { PiPlugLight, PiPlusLight } from 'react-icons/pi'
import { EndpointsPageViewModel } from 'src/pages/EndpointsPage/model/EndpointsPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'
import { BranchFilterPopover } from '../BranchFilterPopover/BranchFilterPopover'
import { TypeFilterPopover } from '../TypeFilterPopover/TypeFilterPopover'
import { CreateEndpointModal } from '../CreateEndpointModal/CreateEndpointModal'
import { EndpointCard } from '../EndpointCard/EndpointCard'
import { SystemApiSection } from '../SystemApiSection/SystemApiSection'

export const EndpointsPage = observer(() => {
  const model = useViewModel(EndpointsPageViewModel)

  if (model.showInitialLoading) {
    return (
      <Page sidebar={<ProjectSidebar />}>
        <Flex justify="center" align="center" height="200px">
          <Spinner />
        </Flex>
      </Page>
    )
  }

  if (model.showError) {
    return (
      <Page sidebar={<ProjectSidebar />}>
        <Flex justify="center" align="center" height="200px">
          <Text color="red.500">Error loading endpoints</Text>
        </Flex>
      </Page>
    )
  }

  if (model.showNoEndpoints) {
    return (
      <Page sidebar={<ProjectSidebar />}>
        <Box mb="4rem">
          <Flex justify="center" align="center" height="200px" flexDirection="column" gap={4}>
            <Box textAlign="center">
              <PiPlugLight size={48} color="var(--chakra-colors-newGray-400)" style={{ margin: '0 auto' }} />
              <Text color="newGray.400" mt={2}>
                No endpoints found
              </Text>
              <Text fontSize="xs" color="newGray.400" mt={1}>
                Create endpoints to expose your data via GraphQL or REST API
              </Text>
            </Box>
            {model.canCreateEndpoint && (
              <Button color="gray" variant="ghost" size="sm" onClick={() => model.createModal.open()} focusRing="none">
                <PiPlusLight />
                Create endpoint
              </Button>
            )}
          </Flex>

          <SystemApiSection model={model.systemApi} />
        </Box>
        <CreateEndpointModal model={model.createModal} />
      </Page>
    )
  }

  return (
    <Page sidebar={<ProjectSidebar />}>
      <Box mb="4rem">
        <Flex justify="space-between" align="center" marginBottom="0.5rem">
          <Text fontSize="20px" fontWeight="600" color="newGray.500">
            Endpoints ({model.totalCount})
          </Text>
          <HStack gap={2}>
            {model.canCreateEndpoint && (
              <Button color="gray" variant="ghost" size="sm" onClick={() => model.createModal.open()}>
                <PiPlusLight />
                Create
              </Button>
            )}
            <TypeFilterPopover
              selectedType={model.selectedType}
              selectedTypeName={model.selectedTypeName}
              onSelect={(type) => model.setSelectedType(type)}
            />
            <BranchFilterPopover
              branches={model.branches}
              selectedBranchId={model.selectedBranchId}
              selectedBranchName={model.selectedBranchName}
              onSelect={(branchId) => model.setSelectedBranchId(branchId)}
            />
          </HStack>
        </Flex>
        <Text fontSize="xs" color="newGray.400" marginBottom="1.5rem">
          Auto-generated APIs based on your table schemas. Create endpoints for specific branch revisions to expose your
          data via GraphQL or REST.
        </Text>

        {model.isFilterLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner />
          </Flex>
        ) : model.showEmptyFiltered ? (
          <Flex justify="center" align="center" height="200px" flexDirection="column" gap={2}>
            <PiPlugLight size={48} color="var(--chakra-colors-newGray-400)" />
            <Text color="newGray.400">No endpoints match the selected filters</Text>
          </Flex>
        ) : model.showList ? (
          <>
            <VStack align="stretch" gap={3}>
              {model.items.map((itemModel) => (
                <EndpointCard key={itemModel.id} model={itemModel} />
              ))}
            </VStack>

            {model.hasNextPage && (
              <Flex justify="center" mt={4}>
                <Button variant="plain" onClick={() => model.tryToFetchNextPage()} loading={model.isLoading}>
                  Load more
                </Button>
              </Flex>
            )}
          </>
        ) : null}

        <SystemApiSection model={model.systemApi} />
      </Box>
      <CreateEndpointModal model={model.createModal} />
    </Page>
  )
})
