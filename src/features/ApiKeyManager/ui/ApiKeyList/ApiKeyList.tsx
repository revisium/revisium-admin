import { Box, Button, Flex, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { PiArrowClockwiseLight, PiPlusLight, PiTrashLight } from 'react-icons/pi'
import { ApiKeyRow } from 'src/entities/ApiKey'
import { ApiKeyManagerViewModel } from '../../model/ApiKeyManagerViewModel.ts'
import { CreateKeyDialog } from '../CreateKeyDialog/CreateKeyDialog.tsx'
import { RevokeConfirmDialog } from '../RevokeConfirmDialog/RevokeConfirmDialog.tsx'
import { RotateConfirmDialog } from '../RotateConfirmDialog/RotateConfirmDialog.tsx'
import { SecretRevealDialog } from '../SecretRevealDialog/SecretRevealDialog.tsx'

interface ApiKeyListProps {
  model: ApiKeyManagerViewModel
  showCreateButton?: boolean
}

export const ApiKeyList: FC<ApiKeyListProps> = observer(({ model, showCreateButton = true }) => {
  useEffect(() => {
    void model.loadKeys()
    return () => model.reset()
  }, [model])

  if (!model.isLoaded) {
    return (
      <Flex justify="center" py={8}>
        <Spinner size="md" color="gray.400" />
      </Flex>
    )
  }

  if (model.error) {
    return (
      <Box p={4} bg="red.50" borderRadius="md" borderWidth="1px" borderColor="red.200">
        <Text fontSize="sm" color="red.600">
          {model.error}
        </Text>
      </Box>
    )
  }

  return (
    <VStack align="stretch" gap={3}>
      {showCreateButton && !model.isEmpty && (
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.500">
            {`${model.sortedItems.length} key${model.sortedItems.length === 1 ? '' : 's'}`}
          </Text>
          <Button size="sm" onClick={model.openCreateDialog}>
            <PiPlusLight />
            Create key
          </Button>
        </Flex>
      )}

      {model.isEmpty && model.isLoaded && (
        <Box p={6} textAlign="center" borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="gray.50">
          <Text fontSize="sm" color="gray.500">
            {model.emptyStateMessage}
          </Text>
          {showCreateButton && (
            <Button size="sm" mt={3} onClick={model.openCreateDialog}>
              <PiPlusLight />
              Create your first key
            </Button>
          )}
        </Box>
      )}

      {model.sortedItems.map((item) => (
        <ApiKeyRow
          key={item.id}
          name={item.name}
          prefix={item.prefix}
          status={item.statusLabel}
          permissionLabel={item.permissionLabel}
          permissionColor={item.permissionColorPalette}
          projects={item.resolvedProjects}
          lastUsedAt={item.lastUsedAt}
          createdAt={item.createdAt}
          expiresAt={item.expiresAt}
          actions={
            item.isActive ? (
              <HStack gap={1}>
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.500"
                  _hover={{ color: 'orange.600', bg: 'orange.50' }}
                  onClick={() => model.openRotateDialog(item.id)}
                >
                  <PiArrowClockwiseLight />
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.500"
                  _hover={{ color: 'red.600', bg: 'red.50' }}
                  onClick={() => model.openRevokeDialog(item.id)}
                >
                  <PiTrashLight />
                </Button>
              </HStack>
            ) : undefined
          }
        />
      ))}

      <CreateKeyDialog model={model} />

      <SecretRevealDialog
        isOpen={model.isSecretDialogOpen}
        secret={model.lastSecret}
        keyName={model.lastCreatedKeyName}
        onClose={model.closeSecretDialog}
      />

      <RevokeConfirmDialog
        isOpen={model.isRevokeDialogOpen}
        keyName={model.selectedKey?.name}
        isLoading={model.isMutating}
        onConfirm={model.revokeKey}
        onClose={model.closeRevokeDialog}
      />

      <RotateConfirmDialog
        isOpen={model.isRotateDialogOpen}
        keyName={model.selectedKey?.name}
        isLoading={model.isMutating}
        onConfirm={model.rotateKey}
        onClose={model.closeRotateDialog}
      />
    </VStack>
  )
})
