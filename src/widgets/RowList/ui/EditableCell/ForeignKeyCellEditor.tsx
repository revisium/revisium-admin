import { Box, Popover, Portal } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { SearchForeignKey } from 'src/features/SearchForeignKey'

interface ForeignKeyCellEditorProps {
  value: string
  revisionId: string
  foreignTableId: string
  rowId: string
  onSave: (value: string) => void
  onCancel: () => void
}

export const ForeignKeyCellEditor: FC<ForeignKeyCellEditorProps> = observer(
  ({ value, revisionId, foreignTableId, rowId, onSave, onCancel }) => {
    const [isOpen, setIsOpen] = useState(true)
    const triggerRef = useRef<HTMLDivElement>(null)
    const lastRectRef = useRef<DOMRect | null>(null)

    const getAnchorRect = useCallback(() => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (rect && rect.width > 0) {
        lastRectRef.current = rect
      }
      return lastRectRef.current
    }, [])

    useEffect(() => {
      setIsOpen(true)
    }, [])

    const handleSelect = useCallback(
      (newValue: string) => {
        setIsOpen(false)
        if (newValue !== value) {
          onSave(newValue)
        } else {
          onCancel()
        }
      },
      [value, onSave, onCancel],
    )

    const handleClose = useCallback(() => {
      setIsOpen(false)
      onCancel()
    }, [onCancel])

    return (
      <>
        <Box ref={triggerRef} width="100%" height="100%" display="flex" alignItems="center">
          {value || <Box color="gray.400">Select...</Box>}
        </Box>
        <Popover.Root
          lazyMount
          unmountOnExit
          open={isOpen}
          onOpenChange={({ open }) => {
            if (!open) {
              handleClose()
            }
          }}
          autoFocus={false}
          closeOnInteractOutside={true}
          modal={false}
          positioning={{
            placement: 'bottom-start',
            getAnchorRect,
          }}
        >
          <Portal>
            <Popover.Positioner>
              <Popover.Content width="320px" p={0}>
                <SearchForeignKey
                  revisionId={revisionId}
                  tableId={foreignTableId}
                  onChange={handleSelect}
                  onClose={handleClose}
                  disableFooterActions
                  rowLinkPath={rowId}
                />
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      </>
    )
  },
)
