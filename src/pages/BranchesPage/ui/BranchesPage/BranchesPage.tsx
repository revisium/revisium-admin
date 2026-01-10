import { Box, Button, Flex, HoverCard, HStack, Icon, Portal, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { PiInfoLight, PiPlusLight } from 'react-icons/pi'
import { Virtuoso } from 'react-virtuoso'
import { BranchesPageViewModel } from 'src/pages/BranchesPage/model/BranchesPageViewModel.ts'
import { BranchCard } from 'src/pages/BranchesPage/ui/BranchCard/BranchCard.tsx'
import { CreateBranchDialog } from 'src/pages/BranchesPage/ui/CreateBranchDialog/CreateBranchDialog.tsx'
import { useViewModel } from 'src/shared/lib'
import { Page, Tooltip } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'

export const BranchesPage = observer(() => {
  const model = useViewModel(BranchesPageViewModel)

  if (model.showLoading) {
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
          <Text color="red.500">Error loading branches</Text>
        </Flex>
      </Page>
    )
  }

  if (model.showEmpty) {
    return (
      <Page sidebar={<ProjectSidebar />}>
        <Box mb="4rem">
          <HStack justify="space-between" align="flex-start" mb={6}>
            <Text fontSize="20px" fontWeight="600" color="newGray.500">
              Branches
            </Text>
          </HStack>
          <VStack justify="center" align="center" height="200px" color="newGray.400">
            <Text fontSize="md">No branches found</Text>
          </VStack>
        </Box>
      </Page>
    )
  }

  return (
    <Page sidebar={<ProjectSidebar />}>
      <Box mb="4rem">
        <HStack justify="space-between" align="flex-start" mb={1}>
          <Text fontSize="20px" fontWeight="600" color="newGray.500">
            Branches
          </Text>
          {model.canCreateBranch && (
            <Tooltip content="Create a new branch from any revision">
              <Button size="xs" variant="ghost" color="newGray.400" onClick={model.openCreateDialog}>
                <PiPlusLight />
                New branch
              </Button>
            </Tooltip>
          )}
        </HStack>
        <HStack gap={1} mb={6}>
          <Text fontSize="xs" color="newGray.400">
            Manage branches in this project.
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
                      Branches allow you to work on different versions of your data independently.
                    </Text>
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="newGray.600">
                        <Text as="span" fontWeight="600">
                          Default branch
                        </Text>{' '}
                        — the main branch created with the project (cannot be deleted).
                      </Text>
                      <Text fontSize="xs" color="newGray.600">
                        <Text as="span" fontWeight="600">
                          Child branches
                        </Text>{' '}
                        — created from any committed revision (not from draft).
                      </Text>
                    </VStack>
                    <Text fontSize="xs" color="newGray.500">
                      Each branch has its own Draft (working copy) and Head (last committed) revisions, plus a history
                      of all commits.
                    </Text>
                    <Text fontSize="xs" color="newGray.500">
                      To create a new branch, click &quot;New branch&quot; and select a source branch and a committed
                      revision.
                    </Text>
                  </VStack>
                </HoverCard.Content>
              </HoverCard.Positioner>
            </Portal>
          </HoverCard.Root>
        </HStack>

        <Virtuoso
          useWindowScroll
          totalCount={model.items.length}
          defaultItemHeight={80}
          endReached={model.hasNextPage ? model.tryToFetchNextPage : undefined}
          itemContent={(index) => {
            const item = model.items[index]

            if (!item) {
              return null
            }

            return (
              <Box key={item.id} mb={3}>
                <BranchCard model={item} />
              </Box>
            )
          }}
        />
      </Box>

      {model.createDialog && <CreateBranchDialog model={model.createDialog} />}
    </Page>
  )
})
