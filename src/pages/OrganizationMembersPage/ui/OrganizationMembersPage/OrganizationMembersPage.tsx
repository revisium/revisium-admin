import { Box, Button, Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { PiPlusLight, PiUsersLight } from 'react-icons/pi'
import { OrganizationMembersPageViewModel } from 'src/pages/OrganizationMembersPage/model/OrganizationMembersPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { OrganizationSidebar } from 'src/widgets/OrganizationSidebar'
import { AddOrgMemberModal } from '../AddOrgMemberModal/AddOrgMemberModal.tsx'
import { OrgMemberCard } from '../OrgMemberCard/OrgMemberCard.tsx'

export const OrganizationMembersPage = observer(() => {
  const model = useViewModel(OrganizationMembersPageViewModel)

  if (model.showInitialLoading) {
    return (
      <Page sidebar={<OrganizationSidebar />}>
        <Flex justify="center" align="center" height="200px">
          <Spinner />
        </Flex>
      </Page>
    )
  }

  if (model.showError) {
    return (
      <Page sidebar={<OrganizationSidebar />}>
        <Flex justify="center" align="center" height="200px">
          <Text color="red.500">Error loading members</Text>
        </Flex>
      </Page>
    )
  }

  if (model.showNoMembers) {
    return (
      <Page sidebar={<OrganizationSidebar />}>
        <Box mb="4rem">
          <Flex justify="center" align="center" height="200px" flexDirection="column" gap={4}>
            <Box textAlign="center">
              <PiUsersLight size={48} color="var(--chakra-colors-newGray-400)" style={{ margin: '0 auto' }} />
              <Text color="newGray.400" mt={2}>
                No members in this organization
              </Text>
              <Text fontSize="xs" color="newGray.400" mt={1}>
                Add team members to collaborate in this organization
              </Text>
            </Box>
            {model.canAddMember && (
              <Button
                color="gray"
                variant="ghost"
                size="sm"
                onClick={() => model.addMemberModal.open()}
                focusRing="none"
              >
                <PiPlusLight />
                Add member
              </Button>
            )}
          </Flex>
        </Box>
        <AddOrgMemberModal model={model.addMemberModal} />
      </Page>
    )
  }

  return (
    <Page sidebar={<OrganizationSidebar />}>
      <Box mb="4rem">
        <Flex justify="space-between" align="center" marginBottom="0.5rem">
          <Text fontSize="20px" fontWeight="600" color="newGray.500">
            Members ({model.totalCount})
          </Text>
          {model.canAddMember && (
            <Button color="gray" variant="ghost" size="sm" onClick={() => model.addMemberModal.open()}>
              <PiPlusLight />
              Add
            </Button>
          )}
        </Flex>
        <Text fontSize="xs" color="newGray.400" marginBottom="1.5rem">
          Manage team members and their access levels for this organization.
        </Text>

        <VStack align="stretch" gap={3}>
          {model.items.map((itemModel) => (
            <OrgMemberCard key={itemModel.id} model={itemModel} />
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
      <AddOrgMemberModal model={model.addMemberModal} />
    </Page>
  )
})
