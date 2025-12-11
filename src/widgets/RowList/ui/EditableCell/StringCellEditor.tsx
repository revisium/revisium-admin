import { Box, IconButton, Portal, Textarea } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { PiX } from 'react-icons/pi'
import { useCellPosition } from '../../hooks/useCellPosition'

interface CellPosition {
  top: number
  left: number
  width: number
  height: number
}

interface StringCellEditorProps {
  value: string
  onSave: (value: string | number) => void
  onCancel: () => void
  onCommitAndMove?: (direction: 'down' | 'next' | 'prev') => void
  clickOffset?: number
  type?: 'string' | 'number'
  defaultValue?: number
  initialPosition?: CellPosition
  readOnly?: boolean
}

const MAX_VISIBLE_LINES = 3
const LINE_HEIGHT = 20
const CELL_HEIGHT = 40
const HEADER_HEIGHT = 24
const VERTICAL_PADDING = (CELL_HEIGHT - LINE_HEIGHT) / 2
const MAX_HEIGHT = MAX_VISIBLE_LINES * LINE_HEIGHT + VERTICAL_PADDING * 2

const isValidNumberInput = (value: string): boolean => {
  if (value === '' || value === '-' || value === '.') {
    return true
  }
  const num = Number(value)
  return !Number.isNaN(num) || value === '-.' || value.endsWith('.')
}

export const StringCellEditor: FC<StringCellEditorProps> = observer(
  ({
    value,
    onSave,
    onCancel,
    onCommitAndMove,
    clickOffset,
    type = 'string',
    defaultValue = 0,
    initialPosition,
    readOnly = false,
  }) => {
    const [localValue, setLocalValue] = useState(value)
    const savedRef = useRef(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { anchorRef, position } = useCellPosition(initialPosition)

    const hasFocused = useRef(false)
    useLayoutEffect(() => {
      if (textareaRef.current && position && !hasFocused.current) {
        hasFocused.current = true
        textareaRef.current.focus()
        if (!readOnly) {
          const cursorPos = clickOffset !== undefined ? Math.min(clickOffset, value.length) : value.length
          textareaRef.current.setSelectionRange(cursorPos, cursorPos)
        }
      }
    }, [clickOffset, value.length, position, readOnly])

    const hasAutoResized = useRef(false)
    useLayoutEffect(() => {
      if (textareaRef.current && !hasAutoResized.current) {
        hasAutoResized.current = true
        textareaRef.current.style.height = `${CELL_HEIGHT}px`
        const scrollHeight = textareaRef.current.scrollHeight
        if (scrollHeight > CELL_HEIGHT) {
          const newHeight = Math.min(scrollHeight, MAX_HEIGHT)
          textareaRef.current.style.height = `${newHeight}px`
        }
      }
    }, [position])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        if (type === 'number' && !isValidNumberInput(newValue)) {
          return
        }
        setLocalValue(newValue)
      },
      [type],
    )

    const handleSave = useCallback(() => {
      if (savedRef.current) return
      savedRef.current = true

      if (type === 'number') {
        const parsed = Number.parseFloat(localValue)
        const originalNumber = Number.parseFloat(value)
        if (Number.isNaN(parsed) || localValue === '') {
          if (defaultValue !== originalNumber) {
            onSave(defaultValue)
          } else {
            onCancel()
          }
        } else if (parsed !== originalNumber) {
          onSave(parsed)
        } else {
          onCancel()
        }
      } else {
        let trimmedValue = localValue
        while (trimmedValue.endsWith('\n')) {
          trimmedValue = trimmedValue.slice(0, -1)
        }
        if (trimmedValue === value) {
          onCancel()
        } else {
          onSave(trimmedValue)
        }
      }
    }, [localValue, value, onSave, onCancel, type, defaultValue])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          savedRef.current = true
          setLocalValue(value)
          onCancel()
          return
        }
        if (readOnly) {
          return
        }
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          handleSave()
          onCommitAndMove?.('down')
        }
        if (e.key === 'Tab') {
          e.preventDefault()
          handleSave()
          onCommitAndMove?.(e.shiftKey ? 'prev' : 'next')
        }
      },
      [handleSave, onCommitAndMove, onCancel, value, readOnly],
    )

    const handleBlur = useCallback(
      (e: React.FocusEvent) => {
        const relatedTarget = e.relatedTarget as HTMLElement | null
        if (relatedTarget?.closest('[data-close-button]')) {
          return
        }
        if (readOnly) {
          onCancel()
          return
        }
        handleSave()
      },
      [handleSave, readOnly, onCancel],
    )

    const outlineColor = readOnly ? 'gray.400' : 'blue.500'

    return (
      <>
        <span ref={anchorRef} style={{ position: 'absolute', top: 0, left: 0 }} />
        {position && (
          <Portal>
            <Box
              position="fixed"
              top={`${position.top - (readOnly ? HEADER_HEIGHT : 0)}px`}
              left={`${position.left}px`}
              zIndex={9999}
            >
              {readOnly && (
                <Box
                  height={`${HEADER_HEIGHT}px`}
                  bg="gray.100"
                  px="8px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  fontSize="12px"
                  color="gray.600"
                  borderTopRadius="4px"
                  border="1px solid"
                  borderColor="gray.300"
                  borderBottom="none"
                >
                  <span>View only</span>
                  <IconButton
                    aria-label="Close"
                    size="2xs"
                    variant="ghost"
                    color="gray.500"
                    _hover={{ color: 'gray.700', bg: 'gray.200' }}
                    onClick={onCancel}
                    minW="16px"
                    h="16px"
                    data-close-button
                  >
                    <PiX />
                  </IconButton>
                </Box>
              )}
              <Textarea
                ref={textareaRef}
                value={localValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                readOnly={readOnly}
                width={`${position.width}px`}
                minWidth={`${position.width}px`}
                height={`${CELL_HEIGHT}px`}
                minHeight={`${CELL_HEIGHT}px`}
                bg="white"
                borderRadius={readOnly ? '0 0 4px 4px' : '0'}
                border={readOnly ? '1px solid' : 'none'}
                borderColor={readOnly ? 'gray.300' : undefined}
                borderTop={readOnly ? 'none' : undefined}
                outline={readOnly ? 'none' : '2px solid'}
                outlineColor={readOnly ? undefined : outlineColor}
                outlineOffset={readOnly ? undefined : '-2px'}
                px="8px"
                py={`${VERTICAL_PADDING}px`}
                m={0}
                fontFamily="inherit"
                fontSize="16px"
                fontWeight="300"
                lineHeight={`${LINE_HEIGHT}px`}
                resize="both"
                overflow="auto"
                boxShadow="0 4px 12px rgba(0,0,0,0.15)"
                cursor={readOnly ? 'default' : undefined}
                _focus={{
                  outline: readOnly ? 'none' : '2px solid',
                  outlineColor: readOnly ? undefined : outlineColor,
                  outlineOffset: readOnly ? undefined : '-2px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              />
            </Box>
          </Portal>
        )}
      </>
    )
  },
)
