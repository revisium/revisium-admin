import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useRef, useState } from 'react'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable'

interface NumberCellEditorProps {
  value: number
  defaultValue: number
  onSave: (value: number) => void
  onCancel: () => void
  onCommitAndMove?: (direction: 'down' | 'next' | 'prev') => void
  autoFocus?: boolean
}

const NUMBER_RESTRICT = /^[\d.-]$/

export const NumberCellEditor: FC<NumberCellEditorProps> = observer(
  ({ value, defaultValue, onSave, onCancel, onCommitAndMove, autoFocus = true }) => {
    const [localValue, setLocalValue] = useState(String(value))
    const savedRef = useRef(false)

    const handleChange = useCallback((newValue: string) => {
      setLocalValue(newValue)
    }, [])

    const parseAndSave = useCallback(() => {
      if (savedRef.current) return
      savedRef.current = true
      const parsed = Number.parseFloat(localValue)
      if (Number.isNaN(parsed)) {
        onSave(defaultValue)
      } else if (parsed !== value) {
        onSave(parsed)
      } else {
        onCancel()
      }
    }, [localValue, value, defaultValue, onSave, onCancel])

    const handleEnter = useCallback(() => {
      parseAndSave()
      onCommitAndMove?.('down')
    }, [parseAndSave, onCommitAndMove])

    const handleEscape = useCallback(() => {
      savedRef.current = true
      setLocalValue(String(value))
      onCancel()
    }, [value, onCancel])

    return (
      <Box width="100%" minWidth={0}>
        <ContentEditable
          initValue={localValue}
          onChange={handleChange}
          onBlur={parseAndSave}
          onEnter={handleEnter}
          onEscape={handleEscape}
          restrict={NUMBER_RESTRICT}
          autoFocus={autoFocus}
        />
      </Box>
    )
  },
)
