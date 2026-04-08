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

interface RotateConfirmDialogProps {
  isOpen: boolean
  keyName: string | undefined
  isLoading: boolean
  onConfirm: () => void
  onClose: () => void
}

export const RotateConfirmDialog: FC<RotateConfirmDialogProps> = observer(
  ({ isOpen, keyName, isLoading, onConfirm, onClose }) => {
    return (
      <DialogRoot open={isOpen} onOpenChange={({ open }) => !open && onClose()} size="md">
        <Portal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rotate API Key</DialogTitle>
              </DialogHeader>

              <DialogBody>
                <VStack align="stretch" gap="1rem">
                  <Text>
                    Are you sure you want to rotate the key <strong>{keyName}</strong>?
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    This will generate a new secret and invalidate the current one. Any applications using the current
                    key will need to be updated.
                  </Text>
                </VStack>
              </DialogBody>

              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button colorPalette="orange" onClick={onConfirm} loading={isLoading}>
                  Rotate key
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
