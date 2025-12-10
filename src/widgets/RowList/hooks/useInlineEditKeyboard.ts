import { useCallback, useEffect } from 'react'
import { isEditableTarget } from '../lib/isEditableTarget'
import { InlineEditModel } from '../model/InlineEditModel'

interface UseInlineEditKeyboardOptions {
  inlineEditModel: InlineEditModel
  enabled?: boolean
}

const handleEditingModeKey = (event: KeyboardEvent, model: InlineEditModel): void => {
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      model.cancelEdit()
      break
    case 'Tab':
      event.preventDefault()
      if (event.shiftKey) {
        model.commitAndMoveLeft()
      } else {
        model.commitAndMoveRight()
      }
      break
  }
}

const handleDisplayModeKey = (event: KeyboardEvent, model: InlineEditModel): void => {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      event.preventDefault()
      model.moveFocus(event.key.replace('Arrow', '').toLowerCase() as 'up' | 'down' | 'left' | 'right')
      break
    case 'Tab':
      event.preventDefault()
      if (event.shiftKey) {
        model.moveFocusToPrev()
      } else {
        model.moveFocusToNext()
      }
      break
    case 'Enter':
    case 'F2':
      event.preventDefault()
      model.enterEditMode()
      break
    case 'Escape':
      event.preventDefault()
      model.clearFocus()
      break
    case 'Delete':
    case 'Backspace':
      break
    default:
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        model.enterEditMode()
      }
  }
}

export const useInlineEditKeyboard = ({ inlineEditModel, enabled = true }: UseInlineEditKeyboardOptions) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !inlineEditModel.hasFocus || isEditableTarget(event.target as HTMLElement)) {
        return
      }

      if (inlineEditModel.isEditing) {
        handleEditingModeKey(event, inlineEditModel)
      } else {
        handleDisplayModeKey(event, inlineEditModel)
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
