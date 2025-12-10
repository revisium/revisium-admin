import { Portal, Textarea } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useLayoutEffect, useRef, useState } from 'react'
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
}

const MAX_VISIBLE_LINES = 3
const LINE_HEIGHT = 20
const CELL_HEIGHT = 40
const VERTICAL_PADDING = (CELL_HEIGHT - LINE_HEIGHT) / 2
const MAX_HEIGHT = MAX_VISIBLE_LINES * LINE_HEIGHT + VERTICAL_PADDING * 2

const NUMBER_PATTERN = /^-?\d*\.?\d*$/

export const StringCellEditor: FC<StringCellEditorProps> = observer(
  ({ value, onSave, onCancel, onCommitAndMove, clickOffset, type = 'string', defaultValue = 0, initialPosition }) => {
    const [localValue, setLocalValue] = useState(value)
    const savedRef = useRef(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { anchorRef, position } = useCellPosition(initialPosition)

    const hasFocused = useRef(false)
    useLayoutEffect(() => {
      if (textareaRef.current && position && !hasFocused.current) {
        hasFocused.current = true
        textareaRef.current.focus()
        const cursorPos = clickOffset !== undefined ? Math.min(clickOffset, value.length) : value.length
        textareaRef.current.setSelectionRange(cursorPos, cursorPos)
      }
    }, [clickOffset, value.length, position])

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
        if (type === 'number') {
          if (newValue === '' || NUMBER_PATTERN.test(newValue)) {
            setLocalValue(newValue)
          }
        } else {
          setLocalValue(newValue)
        }
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
        if (localValue !== value) {
          onSave(localValue)
        } else {
          onCancel()
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
      [handleSave, onCommitAndMove, onCancel, value],
    )

    const handleBlur = useCallback(() => {
      handleSave()
    }, [handleSave])

    return (
      <>
        <span ref={anchorRef} style={{ position: 'absolute', top: 0, left: 0 }} />
        {position && (
          <Portal>
            <Textarea
              ref={textareaRef}
              value={localValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              position="fixed"
              top={`${position.top}px`}
              left={`${position.left}px`}
              width={`${position.width}px`}
              minWidth={`${position.width}px`}
              zIndex={9999}
              height={`${CELL_HEIGHT}px`}
              minHeight={`${CELL_HEIGHT}px`}
              bg="white"
              borderRadius="0"
              border="none"
              outline="2px solid"
              outlineColor="blue.500"
              outlineOffset="-2px"
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
              _focus={{
                outline: '2px solid',
                outlineColor: 'blue.500',
                outlineOffset: '-2px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            />
          </Portal>
        )}
      </>
    )
  },
)
