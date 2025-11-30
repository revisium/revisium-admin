import { Box, Button, Flex, Input, Portal, Spinner, Tabs, Text, VStack } from '@chakra-ui/react'
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from '@chakra-ui/react/dialog'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiCheckLight, PiUserLight } from 'react-icons/pi'
import { AddUserModalViewModel } from 'src/pages/UsersPage/model/AddUserModalViewModel.ts'
import { RoleSelect } from '../RoleSelect'

interface AddUserModalProps {
  model: AddUserModalViewModel
}

export const AddUserModal: FC<AddUserModalProps> = observer(({ model }) => {
  return (
    <DialogRoot open={model.isOpen} onOpenChange={({ open }) => !open && model.close()} size="lg">
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add User to Project</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <Tabs.Root
                value={model.activeTab}
                onValueChange={({ value }) => model.setActiveTab(value as 'search' | 'create')}
              >
                <Tabs.List marginBottom="1rem">
                  <Tabs.Trigger value="search">Search User</Tabs.Trigger>
                  {model.canCreateUser && <Tabs.Trigger value="create">Create New</Tabs.Trigger>}
                </Tabs.List>

                <Tabs.Content value="search">
                  <VStack align="stretch" gap="1rem">
                    <Flex flexDirection="column" gap="0.5rem">
                      <Text fontSize="sm" fontWeight="500" color="gray.600">
                        Search by username or email
                      </Text>
                      <Input
                        placeholder="Enter username or email..."
                        value={model.searchQuery}
                        onChange={(e) => model.setSearchQuery(e.target.value)}
                        autoComplete="off"
                      />
                    </Flex>

                    {model.isSearching ? (
                      <Flex justify="center" padding="2rem">
                        <Spinner />
                      </Flex>
                    ) : model.searchResults.length > 0 ? (
                      <VStack align="stretch" gap="0.5rem" maxHeight="200px" overflowY="auto">
                        {model.searchResults.map((user) => (
                          <Box
                            key={user.id}
                            padding="0.75rem"
                            borderWidth="1px"
                            borderColor={model.selectedUserId === user.id ? 'blue.500' : 'newGray.200'}
                            borderRadius="md"
                            backgroundColor={model.selectedUserId === user.id ? 'blue.50' : 'white'}
                            cursor="pointer"
                            onClick={() => model.setSelectedUserId(user.id)}
                            _hover={{ borderColor: 'blue.300' }}
                            transition="all 0.2s"
                          >
                            <Flex align="center" justify="space-between">
                              <Flex align="center" gap={2}>
                                <PiUserLight size={16} />
                                <Box>
                                  <Text fontSize="sm" fontWeight="500">
                                    {user.username || user.email || user.id}
                                  </Text>
                                  {user.username && user.email && (
                                    <Text fontSize="xs" color="gray.500">
                                      {user.email}
                                    </Text>
                                  )}
                                </Box>
                              </Flex>
                              {model.selectedUserId === user.id && (
                                <PiCheckLight size={16} color="var(--chakra-colors-blue-500)" />
                              )}
                            </Flex>
                          </Box>
                        ))}
                      </VStack>
                    ) : model.searchQuery.length > 0 ? (
                      <Text fontSize="sm" color="gray.500" textAlign="center" padding="2rem">
                        No users found
                      </Text>
                    ) : null}

                    <Flex flexDirection="column" gap="0.5rem">
                      <Text fontSize="sm" fontWeight="500" color="gray.600">
                        Role
                      </Text>
                      <RoleSelect value={model.selectedRole} onChange={model.setSelectedRole} />
                    </Flex>
                  </VStack>
                </Tabs.Content>

                {model.canCreateUser && (
                  <Tabs.Content value="create">
                    <VStack align="stretch" gap="1rem">
                      <Flex flexDirection="column" gap="0.5rem">
                        <Text fontSize="sm" fontWeight="500" color="gray.600">
                          Username *
                        </Text>
                        <Input
                          placeholder="Enter username..."
                          value={model.newUsername}
                          onChange={(e) => model.setNewUsername(e.target.value)}
                          autoComplete="off"
                        />
                      </Flex>

                      <Flex flexDirection="column" gap="0.5rem">
                        <Text fontSize="sm" fontWeight="500" color="gray.600">
                          Password *
                        </Text>
                        <Input
                          type="password"
                          placeholder="Enter password (min 6 characters)..."
                          value={model.newPassword}
                          onChange={(e) => model.setNewPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                      </Flex>

                      <Flex flexDirection="column" gap="0.5rem">
                        <Text fontSize="sm" fontWeight="500" color="gray.600">
                          Email (optional)
                        </Text>
                        <Input
                          type="email"
                          placeholder="Enter email..."
                          value={model.newEmail}
                          onChange={(e) => model.setNewEmail(e.target.value)}
                          autoComplete="off"
                        />
                      </Flex>

                      <Flex flexDirection="column" gap="0.5rem">
                        <Text fontSize="sm" fontWeight="500" color="gray.600">
                          Role
                        </Text>
                        <RoleSelect value={model.selectedRole} onChange={model.setSelectedRole} />
                      </Flex>
                    </VStack>
                  </Tabs.Content>
                )}
              </Tabs.Root>
            </DialogBody>

            <DialogFooter>
              <Button variant="outline" onClick={model.close}>
                Cancel
              </Button>
              {model.activeTab === 'search' ? (
                <Button onClick={model.addSelectedUser} disabled={!model.canAddSelectedUser} loading={model.isAdding}>
                  Add User
                </Button>
              ) : (
                <Button onClick={model.createAndAddUser} disabled={!model.canCreateNewUser} loading={model.isCreating}>
                  Create & Add
                </Button>
              )}
            </DialogFooter>

            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  )
})
