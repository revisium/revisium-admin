import { Button, Portal, Text, VStack } from '@chakra-ui/react'
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

interface RevokeConfirmDialogProps {
  isOpen: boolean
  keyName: string | undefined
  isLoading: boolean
  onConfirm: () => void
  onClose: () => void
}

export const RevokeConfirmDialog: FC<RevokeConfirmDialogProps> = observer(
  ({ isOpen, keyName, isLoading, onConfirm, onClose }) => {
    return (
      <DialogRoot open={isOpen} onOpenChange={({ open }) => !open && onClose()} size="md">
        <Portal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Revoke API Key</DialogTitle>
              </DialogHeader>

              <DialogBody>
                <VStack align="stretch" gap="1rem">
                  <Text>
                    Are you sure you want to revoke the key <strong>{keyName}</strong>?
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    This action cannot be undone. Any applications using this key will immediately lose access.
                  </Text>
                </VStack>
              </DialogBody>

              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button colorPalette="red" onClick={onConfirm} loading={isLoading}>
                  Revoke key
                </Button>
              </DialogFooter>

              <DialogCloseTrigger />
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    )
  },
)
