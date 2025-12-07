import { useCallback, useEffect, useRef, useState } from 'react'

interface UseTruncatedTooltipResult<T extends HTMLElement> {
  ref: React.RefObject<T>
  isOpen: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClose: () => void
}

export const useTruncatedTooltip = <T extends HTMLElement = HTMLElement>(): UseTruncatedTooltipResult<T> => {
  const ref = useRef<T>(null!)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    return () => setIsOpen(false)
  }, [])

  const onMouseEnter = useCallback(() => {
    const el = ref.current
    if (!el) return

    const isTruncated = el.scrollWidth > el.clientWidth
    setIsOpen(isTruncated)
  }, [])

  const onMouseLeave = useCallback(() => {
    setIsOpen(false)
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return { ref, isOpen, onMouseEnter, onMouseLeave, onClose }
}
