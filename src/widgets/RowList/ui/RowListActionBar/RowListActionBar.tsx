import { ActionBar, Button, Portal } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { PiCheckSquare, PiTrash, PiX } from 'react-icons/pi'
import { toaster } from 'src/shared/ui'
import { RowListViewModel } from 'src/widgets/RowList/model/RowListViewModel'
import { DeleteRowsConfirmDialog } from 'src/widgets/RowList/ui/DeleteRowsConfirmDialog/DeleteRowsConfirmDialog'

interface RowListActionBarProps {
  model: RowListViewModel
}

export const RowListActionBar: React.FC<RowListActionBarProps> = observer(({ model }) => {
  const { selection, isDeleting, allRowIds } = model
  const selectedCount = selection.selectedCount
  const isAllSelected = selection.isAllSelected(allRowIds)

  const handleSelectAll = useCallback(() => {
    selection.selectAll(allRowIds)
  }, [selection, allRowIds])

  const handleDeleteClick = useCallback(() => {
    selection.openDeleteConfirmation()
  }, [selection])

  const handleConfirmDelete = useCallback(async () => {
    const count = selection.selectedCount
    selection.closeDeleteConfirmation()
    const success = await model.deleteSelectedRows()
    if (success) {
      toaster.info({ description: `${count} ${count === 1 ? 'row' : 'rows'} deleted` })
      selection.exitSelectionMode()
    } else {
      toaster.error({ description: 'Failed to delete rows' })
    }
  }, [model, selection])

  const handleCancelDelete = useCallback(() => {
    selection.closeDeleteConfirmation()
  }, [selection])

  const handleClear = useCallback(() => {
    selection.exitSelectionMode()
  }, [selection])

  return (
    <>
      <ActionBar.Root open={selection.isSelectionMode}>
        <Portal>
          <ActionBar.Positioner zIndex="modal">
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>{selectedCount} selected</ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              {!isAllSelected && (
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  <PiCheckSquare />
                  Select all
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                loading={isDeleting}
                disabled={isDeleting || selectedCount === 0}
              >
                <PiTrash />
                Delete
              </Button>
              <ActionBar.CloseTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <PiX />
                </Button>
              </ActionBar.CloseTrigger>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>

      <DeleteRowsConfirmDialog
        isOpen={selection.isConfirmDeleteOpen}
        selectedCount={selectedCount}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  )
})
