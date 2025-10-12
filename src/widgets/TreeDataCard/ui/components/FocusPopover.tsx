import { Popover, Portal, Box } from '@chakra-ui/react'
import { FC, ReactNode, useRef, useCallback } from 'react'

interface BooleanMenuProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  trigger: ReactNode
  children: ReactNode
  disabled?: boolean
  width?: string
}

export const FocusPopover: FC<BooleanMenuProps> = ({ isOpen, setIsOpen, trigger, children, disabled, width }) => {
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleFocus = useCallback(() => {
    if (!disabled) {
      setIsOpen(true)
    }
  }, [disabled, setIsOpen])

  return (
    <>
      <Box ref={triggerRef} onFocus={handleFocus}>
        {trigger}
      </Box>
      {!disabled && (
        <Popover.Root
          lazyMount
          unmountOnExit
          open={isOpen}
          onOpenChange={({ open }) => setIsOpen(open)}
          autoFocus={false}
          closeOnInteractOutside={true}
          modal={false}
          positioning={{
            placement: 'bottom-start',
            getAnchorRect: () => triggerRef.current?.getBoundingClientRect() || null,
          }}
        >
          <Portal>
            <Popover.Positioner>
              <Popover.Content width={width} p={1}>
                {children}
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      )}
    </>
  )
}
