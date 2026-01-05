import { Box, Button, Flex, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiPlusLight, PiUsersLight } from 'react-icons/pi'
import { Virtuoso } from 'react-virtuoso'
import { useViewModel } from 'src/shared/lib'
import { AdminPageLayout } from 'src/shared/ui/AdminPageLayout'
import { AdminUsersViewModel } from '../../model/AdminUsersViewModel'
import { AdminCreateUserModal } from '../AdminCreateUserModal/AdminCreateUserModal'
import { AdminUserListItem } from '../AdminUserListItem/AdminUserListItem'

export const AdminUsersPage: FC = observer(() => {
  const model = useViewModel(AdminUsersViewModel)

  return (
    <AdminPageLayout
      breadcrumbs={[{ label: 'Users' }]}
      headerRight={
        <Flex alignItems="center" gap="8px">
          <Input
            placeholder="Search..."
            value={model.searchQuery}
            onChange={(e) => model.setSearchQuery(e.target.value)}
            variant="flushed"
            size="sm"
            width="200px"
            _placeholder={{ color: 'gray.400' }}
          />
        </Flex>
      }
    >
      <Box flex={1} paddingX="16px" paddingTop="16px">
        {model.canCreateUser && (
          <Flex paddingBottom="16px">
            <Button variant="ghost" size="sm" color="gray" onClick={() => model.createUserModal.open()}>
              <PiPlusLight />
              Add
            </Button>
          </Flex>
        )}

        {model.showLoading && (
          <VStack flex={1} justifyContent="center">
            <Spinner size="md" color="gray.400" />
          </VStack>
        )}

        {model.showError && (
          <VStack flex={1} justifyContent="center" gap="8px" color="gray.400">
            <Text fontSize="md">Could not load users</Text>
            <Text fontSize="sm">Please retry later</Text>
          </VStack>
        )}

        {model.showEmpty && (
          <VStack flex={1} justifyContent="center" gap="8px" color="gray.400">
            <PiUsersLight size={48} />
            <Text fontSize="md">No users found</Text>
          </VStack>
        )}

        {model.showList && (
          <Virtuoso
            useWindowScroll
            totalCount={model.items.length}
            defaultItemHeight={40}
            endReached={model.hasNextPage ? model.tryToFetchNextPage : undefined}
            itemContent={(index) => {
              const item = model.items[index]

              if (!item) {
                return null
              }

              return <AdminUserListItem key={item.id} model={item} />
            }}
          />
        )}
      </Box>

      <AdminCreateUserModal model={model.createUserModal} />
    </AdminPageLayout>
  )
})
