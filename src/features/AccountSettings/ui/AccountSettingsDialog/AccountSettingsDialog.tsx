import { Box, Button, Flex, Input, Portal, Tabs, Text, VStack } from '@chakra-ui/react'
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from '@chakra-ui/react/dialog'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { PiSignOutLight, PiUserLight, PiLockLight } from 'react-icons/pi'
import { toaster } from 'src/shared/ui'
import { AccountSettingsViewModel } from '../../model/AccountSettingsViewModel.ts'

interface AccountSettingsDialogProps {
  model: AccountSettingsViewModel
}

export const AccountSettingsDialog: FC<AccountSettingsDialogProps> = observer(({ model }) => {
  const handleSavePassword = useCallback(async () => {
    const success = await model.savePassword()
    if (success) {
      toaster.success({ description: 'Password updated successfully' })
    }
  }, [model])

  return (
    <DialogRoot open={model.isOpen} onOpenChange={({ open }) => !open && model.close()} size="md">
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Account Settings</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <Tabs.Root
                value={model.activeTab}
                onValueChange={({ value }) => model.setActiveTab(value as 'account' | 'password')}
              >
                <Tabs.List marginBottom="1rem">
                  <Tabs.Trigger value="account">
                    <PiUserLight />
                    Account
                  </Tabs.Trigger>
                  <Tabs.Trigger value="password">
                    <PiLockLight />
                    Password
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="account">
                  <VStack align="stretch" gap="1rem">
                    {model.username && (
                      <Flex flexDirection="column" gap="0.5rem">
                        <Text fontSize="sm" fontWeight="500" color="gray.600">
                          Username
                        </Text>
                        <Input value={model.username} readOnly />
                      </Flex>
                    )}

                    {model.email && (
                      <Flex flexDirection="column" gap="0.5rem">
                        <Text fontSize="sm" fontWeight="500" color="gray.600">
                          Email
                        </Text>
                        <Input value={model.email} readOnly />
                      </Flex>
                    )}

                    <Box paddingTop="1rem" borderTop="1px solid" borderTopColor="newGray.100">
                      <Button variant="outline" onClick={model.logout} width="100%">
                        <PiSignOutLight />
                        Sign out
                      </Button>
                    </Box>
                  </VStack>
                </Tabs.Content>

                <Tabs.Content value="password">
                  <VStack align="stretch" gap="1rem">
                    {model.hasPassword ? (
                      <Flex flexDirection="column" gap="0.5rem">
                        <Text fontSize="sm" fontWeight="500" color="gray.600">
                          Current Password
                        </Text>
                        <Input
                          type="password"
                          placeholder="Enter current password..."
                          value={model.oldPassword}
                          onChange={(e) => model.setOldPassword(e.target.value)}
                          autoComplete="current-password"
                        />
                      </Flex>
                    ) : (
                      <Text fontSize="sm" color="gray.500">
                        You signed in with a social account. Set a password to enable password login.
                      </Text>
                    )}

                    <Flex flexDirection="column" gap="0.5rem">
                      <Text fontSize="sm" fontWeight="500" color="gray.600">
                        {model.hasPassword ? 'New Password' : 'Password'}
                      </Text>
                      <Input
                        type="password"
                        placeholder="Enter new password (min 8 characters)..."
                        value={model.newPassword}
                        onChange={(e) => model.setNewPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </Flex>

                    <Flex flexDirection="column" gap="0.5rem">
                      <Text fontSize="sm" fontWeight="500" color="gray.600">
                        Confirm Password
                      </Text>
                      <Input
                        type="password"
                        placeholder="Confirm new password..."
                        value={model.confirmPassword}
                        onChange={(e) => model.setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </Flex>

                    {model.passwordError && (
                      <Text fontSize="sm" color="red.500">
                        {model.passwordError}
                      </Text>
                    )}

                    {model.error && (
                      <Text fontSize="sm" color="red.500">
                        {model.error}
                      </Text>
                    )}

                    <Flex justifyContent="flex-end">
                      <Button onClick={handleSavePassword} disabled={!model.canSavePassword} loading={model.isLoading}>
                        {model.hasPassword ? 'Update Password' : 'Set Password'}
                      </Button>
                    </Flex>
                  </VStack>
                </Tabs.Content>
              </Tabs.Root>
            </DialogBody>

            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  )
})
