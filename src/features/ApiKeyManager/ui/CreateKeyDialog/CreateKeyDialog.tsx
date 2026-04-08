import { Box, Button, Flex, HStack, Input, Portal, Text, VStack } from '@chakra-ui/react'
import {
  DialogActionTrigger,
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
import { ApiKeyManagerViewModel } from '../../model/ApiKeyManagerViewModel.ts'

interface CreateKeyDialogProps {
  model: ApiKeyManagerViewModel
}

const expirationOptions = [
  { value: '30d', label: '30 days' },
  { value: '60d', label: '60 days' },
  { value: '90d', label: '90 days' },
  { value: '1y', label: '1 year' },
  { value: 'none', label: 'No expiration' },
]

const permissionOptions = [
  { value: 'read-only' as const, label: 'Read only', description: 'Can only read data' },
  { value: 'read-write' as const, label: 'Read & Write', description: 'Can read, create, and update data' },
  { value: 'full-access' as const, label: 'Full access', description: 'Can read, create, update, and delete data' },
]

export const CreateKeyDialog: FC<CreateKeyDialogProps> = observer(({ model }) => {
  return (
    <DialogRoot
      open={model.isCreateDialogOpen}
      onOpenChange={({ open }) => !open && model.closeCreateDialog()}
      size="md"
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {model.mode === 'personal' ? 'Create Personal API Key' : 'Create Service API Key'}
              </DialogTitle>
            </DialogHeader>

            <DialogBody>
              <VStack align="stretch" gap="1rem">
                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontSize="sm" fontWeight="500" color="gray.600">
                    Name
                  </Text>
                  <Input
                    placeholder="e.g., CI/CD pipeline, Data sync..."
                    value={model.createKeyName}
                    onChange={(e) => model.setCreateKeyName(e.target.value)}
                    autoFocus
                  />
                </Flex>

                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontSize="sm" fontWeight="500" color="gray.600">
                    Expiration
                  </Text>
                  <HStack gap={2} flexWrap="wrap">
                    {expirationOptions.map((option) => (
                      <Button
                        key={option.value}
                        size="sm"
                        variant={model.createKeyExpirationPreset === option.value ? 'solid' : 'outline'}
                        onClick={() => model.setExpirationPreset(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </HStack>
                </Flex>

                {model.mode === 'personal' && (
                  <Flex flexDirection="column" gap="0.5rem">
                    <HStack gap={2}>
                      <Box
                        as="button"
                        onClick={() => model.setCreateKeyReadOnly(!model.createKeyReadOnly)}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        cursor="pointer"
                      >
                        <Box
                          width="18px"
                          height="18px"
                          borderWidth="1px"
                          borderColor={model.createKeyReadOnly ? 'blue.500' : 'gray.300'}
                          borderRadius="sm"
                          bg={model.createKeyReadOnly ? 'blue.500' : 'transparent'}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          transition="all 0.2s"
                        >
                          {model.createKeyReadOnly && (
                            <Text color="white" fontSize="xs" fontWeight="bold" lineHeight={1}>
                              ✓
                            </Text>
                          )}
                        </Box>
                        <Text fontSize="sm" color="gray.700">
                          Read only
                        </Text>
                      </Box>
                    </HStack>
                    <Text fontSize="xs" color="gray.500" pl="26px">
                      Key can only read data, not modify it
                    </Text>
                  </Flex>
                )}

                {model.mode === 'service' && (
                  <Flex flexDirection="column" gap="0.5rem">
                    <Text fontSize="sm" fontWeight="500" color="gray.600">
                      Permissions
                    </Text>
                    <VStack align="stretch" gap={2}>
                      {permissionOptions.map((option) => (
                        <Box
                          key={option.value}
                          as="button"
                          onClick={() => model.setPermissionPreset(option.value)}
                          width="100%"
                          p={3}
                          borderWidth="1px"
                          borderColor={model.createKeyPermissionPreset === option.value ? 'blue.400' : 'gray.200'}
                          borderRadius="md"
                          bg={model.createKeyPermissionPreset === option.value ? 'blue.50' : 'white'}
                          cursor="pointer"
                          textAlign="left"
                          transition="all 0.2s"
                          _hover={{ borderColor: 'blue.300' }}
                        >
                          <Text fontSize="sm" fontWeight="500" color="gray.700">
                            {option.label}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {option.description}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </Flex>
                )}

                {model.defaultProjectId && (
                  <Flex
                    align="center"
                    gap={2}
                    p={3}
                    bg="blue.50"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="blue.200"
                  >
                    <Text fontSize="sm" color="blue.700">
                      This key will be scoped to project <strong>{model.defaultProjectId}</strong>
                    </Text>
                  </Flex>
                )}
              </VStack>
            </DialogBody>

            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
              <Button onClick={model.createKey} disabled={!model.canCreateKey} loading={model.isMutating}>
                Create key
              </Button>
            </DialogFooter>

            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  )
})
