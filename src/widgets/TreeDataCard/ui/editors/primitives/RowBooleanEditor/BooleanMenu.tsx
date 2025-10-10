import { Popover, Portal, Box } from '@chakra-ui/react'
import { FC, ReactNode, useRef, useState, useCallback, useEffect } from 'react'

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
                <Box
                  px={2}
                  py={1.5}
                  cursor="pointer"
                  borderRadius="md"
                  fontSize="sm"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => handleSelect('true')}
                >
                  true
                </Box>
                <Box
                  px={2}
                  py={1.5}
                  cursor="pointer"
                  borderRadius="md"
                  fontSize="sm"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => handleSelect('false')}
                >
                  false
                </Box>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      )}
    </>
  )
}
