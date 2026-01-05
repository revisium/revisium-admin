import { Button, Flex, Input, Portal, Text, VStack } from '@chakra-ui/react'
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
import { UserSystemRole } from 'src/__generated__/graphql-request'
import { AdminCreateUserModalViewModel } from '../../model/AdminCreateUserModalViewModel'
import { SystemRoleSelect } from '../SystemRoleSelect/SystemRoleSelect'

interface AdminCreateUserModalProps {
  model: AdminCreateUserModalViewModel
}

export const AdminCreateUserModal: FC<AdminCreateUserModalProps> = observer(({ model }) => {
  return (
    <DialogRoot open={model.isOpen} onOpenChange={({ open }) => !open && model.close()} size="md">
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <VStack align="stretch" gap="1rem">
                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontSize="sm" fontWeight="500" color="gray.600">
                    Username *
                  </Text>
                  <Input
                    placeholder="Enter username..."
                    value={model.username}
                    onChange={(e) => model.setUsername(e.target.value)}
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
                    value={model.password}
                    onChange={(e) => model.setPassword(e.target.value)}
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
                    value={model.email}
                    onChange={(e) => model.setEmail(e.target.value)}
                    autoComplete="off"
                  />
                </Flex>

                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontSize="sm" fontWeight="500" color="gray.600">
                    System Role
                  </Text>
                  <SystemRoleSelect
                    value={model.selectedRole}
                    onChange={(role) => model.setSelectedRole(role as UserSystemRole)}
                  />
                </Flex>
              </VStack>
            </DialogBody>

            <DialogFooter>
              <Button variant="outline" onClick={model.close}>
                Cancel
              </Button>
              <Button onClick={model.createUser} disabled={!model.canSubmit} loading={model.isCreating}>
                Create
              </Button>
            </DialogFooter>

            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  )
})
