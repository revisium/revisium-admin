import { Popover, Portal, Box } from '@chakra-ui/react'
import { FC, ReactNode, useRef, useState, useCallback, useEffect } from 'react'
import { BooleanMenuItem } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowBooleanEditor/BooleanMenuItem.tsx'

interface BooleanMenuProps {
  children: ReactNode
  value: string
  onChange: (value: boolean) => void
  disabled?: boolean
}

export const BooleanMenu: FC<BooleanMenuProps> = ({ children, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const openTimeoutRef = useRef<NodeJS.Timeout>()

  const handleFocus = useCallback(() => {
    if (!disabled) {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current)
      }

      openTimeoutRef.current = setTimeout(() => {
        setIsOpen(true)
      }, 100)
    }
  }, [disabled])

  const handleBlur = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
    }
  }, [])

  const handleSelect = useCallback(
    (value: string) => {
      const boolValue = value === 'true'
      onChange(boolValue)
      setIsOpen(false)
    },
    [onChange],
  )

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <Box ref={triggerRef} onFocus={handleFocus} onBlur={handleBlur}>
        {children}
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
              <Popover.Content width="60px" p={1}>
                <BooleanMenuItem onClick={() => handleSelect('true')}>true</BooleanMenuItem>
                <BooleanMenuItem onClick={() => handleSelect('false')}>false</BooleanMenuItem>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      )}
    </>
  )
}
