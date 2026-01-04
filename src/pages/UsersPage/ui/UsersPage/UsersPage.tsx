import { Box, Button, Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { PiPlusLight, PiUsersLight } from 'react-icons/pi'
import { UsersPageViewModel } from 'src/pages/UsersPage/model/UsersPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { AccountButton } from 'src/widgets/AccountButton'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'
import { AddUserModal } from '../AddUserModal'
import { UserCard } from '../UserCard'

export const UsersPage = observer(() => {
  const model = useViewModel(UsersPageViewModel)

  if (model.showInitialLoading) {
    return (
      <Page sidebar={<ProjectSidebar />} footer={<AccountButton />}>
        <Flex justify="center" align="center" height="200px">
          <Spinner />
        </Flex>
      </Page>
    )
  }

  if (model.showError) {
    return (
      <Page sidebar={<ProjectSidebar />} footer={<AccountButton />}>
        <Flex justify="center" align="center" height="200px">
          <Text color="red.500">Error loading users</Text>
        </Flex>
      </Page>
    )
  }

  if (model.showNoUsers) {
    return (
      <Page sidebar={<ProjectSidebar />} footer={<AccountButton />}>
        <Box mb="4rem">
          <Flex justify="center" align="center" height="200px" flexDirection="column" gap={4}>
            <Box textAlign="center">
              <PiUsersLight size={48} color="var(--chakra-colors-newGray-400)" style={{ margin: '0 auto' }} />
              <Text color="newGray.400" mt={2}>
                No users in this project
              </Text>
              <Text fontSize="xs" color="newGray.400" mt={1}>
                Add team members to collaborate on this project
              </Text>
            </Box>
            {model.canAddUser && (
              <Button color="gray" variant="ghost" size="sm" onClick={() => model.addUserModal.open()} focusRing="none">
                <PiPlusLight />
                Add user
              </Button>
            )}
          </Flex>
        </Box>
        <AddUserModal model={model.addUserModal} />
      </Page>
    )
  }

  return (
    <Page sidebar={<ProjectSidebar />} footer={<AccountButton />}>
      <Box mb="4rem">
        <Flex justify="space-between" align="center" marginBottom="0.5rem">
          <Text fontSize="20px" fontWeight="600" color="newGray.500">
            Users ({model.totalCount})
          </Text>
          {model.canAddUser && (
            <Button color="gray" variant="ghost" size="sm" onClick={() => model.addUserModal.open()}>
              <PiPlusLight />
              Add
            </Button>
          )}
        </Flex>
        <Text fontSize="xs" color="newGray.400" marginBottom="1.5rem">
          Manage team members and their access levels for this project.
        </Text>

        <VStack align="stretch" gap={3}>
          {model.items.map((itemModel) => (
            <UserCard key={itemModel.id} model={itemModel} />
          ))}
        </VStack>

        {model.hasNextPage && (
          <Flex justify="center" mt={4}>
            <Button variant="plain" onClick={() => model.tryToFetchNextPage()} loading={model.isLoading}>
              Load more
            </Button>
          </Flex>
        )}
      </Box>
      <AddUserModal model={model.addUserModal} />
    </Page>
  )
})
