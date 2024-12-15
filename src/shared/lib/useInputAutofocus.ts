import { useCallback } from 'react'

type UseInputAutofocusType = (node: HTMLInputElement | null) => void

export const useInputAutofocus = (): UseInputAutofocusType => {
  return useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus()
    }
  }, [])
}
