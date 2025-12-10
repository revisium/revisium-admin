import { useCallback, useEffect } from 'react'
import { isEditableTarget } from '../lib/isEditableTarget'
import { InlineEditModel } from '../model/InlineEditModel'

interface UseInlineEditKeyboardOptions {
  inlineEditModel: InlineEditModel
  enabled?: boolean
}

export const useInlineEditKeyboard = ({ inlineEditModel, enabled = true }: UseInlineEditKeyboardOptions) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) {
        return
      }

      if (!inlineEditModel.hasFocus) {
        return
      }

      if (isEditableTarget(event.target as HTMLElement)) {
        return
      }

      if (inlineEditModel.isEditing) {
        switch (event.key) {
          case 'Escape':
            event.preventDefault()
            inlineEditModel.cancelEdit()
            break
          case 'Tab':
            event.preventDefault()
            if (event.shiftKey) {
              inlineEditModel.commitAndMoveLeft()
            } else {
              inlineEditModel.commitAndMoveRight()
            }
            break
          // Enter is handled by the cell editor component
        }
      } else {
        // Display mode keyboard handling
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault()
            inlineEditModel.moveFocus('up')
            break
          case 'ArrowDown':
            event.preventDefault()
            inlineEditModel.moveFocus('down')
            break
          case 'ArrowLeft':
            event.preventDefault()
            inlineEditModel.moveFocus('left')
            break
          case 'ArrowRight':
            event.preventDefault()
            inlineEditModel.moveFocus('right')
            break
          case 'Tab':
            event.preventDefault()
            if (event.shiftKey) {
              inlineEditModel.moveFocusToPrev()
            } else {
              inlineEditModel.moveFocusToNext()
            }
            break
          case 'Enter':
          case 'F2':
            event.preventDefault()
            inlineEditModel.enterEditMode()
            break
          case 'Escape':
            event.preventDefault()
            inlineEditModel.clearFocus()
            break
          case 'Delete':
          case 'Backspace':
            break
          default:
            if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
              inlineEditModel.enterEditMode()
            }
        }
      }
    },
    [enabled, inlineEditModel],
  )

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, handleKeyDown])
}
