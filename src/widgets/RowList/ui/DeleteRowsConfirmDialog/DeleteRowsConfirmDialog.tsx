import { Button, Dialog, Portal, Text } from '@chakra-ui/react'
import React from 'react'

interface DeleteRowsConfirmDialogProps {
  isOpen: boolean
  count: number
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteRowsConfirmDialog: React.FC<DeleteRowsConfirmDialogProps> = ({
  isOpen,
  count,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onCancel()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete {count === 1 ? 'row' : 'rows'}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body display="flex" flexDirection="column" gap={3}>
              <Text>
                Are you sure you want to delete {count} {count === 1 ? 'row' : 'rows'}?
              </Text>
              <Text color="fg.muted" fontSize="sm">
                Tip: Commit your changes first to preserve them in revision history.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button colorPalette="red" onClick={onConfirm}>
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
