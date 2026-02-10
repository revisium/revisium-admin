import { Box, Popover, Portal } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { FocusPopoverItem } from 'src/shared/ui/FocusPopoverItem/FocusPopoverItem'

interface BooleanCellEditorProps {
  value: boolean
  onSave: (value: boolean) => void
  onCancel: () => void
}

export const BooleanCellEditor: FC<BooleanCellEditorProps> = observer(({ value, onSave, onCancel }) => {
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
    (newValue: boolean) => {
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
        {String(value)}
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
        autoFocus={true}
        closeOnInteractOutside={true}
        modal={false}
        positioning={{
          placement: 'bottom-start',
          getAnchorRect,
        }}
      >
        <Portal>
          <Popover.Positioner>
            <Popover.Content width="80px" p={1}>
              <FocusPopoverItem onClick={() => handleSelect(true)}>true</FocusPopoverItem>
              <FocusPopoverItem onClick={() => handleSelect(false)}>false</FocusPopoverItem>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </>
  )
})
