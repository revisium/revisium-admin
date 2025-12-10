import { useLayoutEffect, useRef, useState } from 'react'

interface CellPositionInput {
  top: number
  left: number
  width: number
  height: number
}

interface CellPositionOutput {
  top: number
  left: number
  width: number
}

export const useCellPosition = (initialPosition?: CellPositionInput) => {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const [position, setPosition] = useState<CellPositionOutput | null>(
    initialPosition ? { top: initialPosition.top, left: initialPosition.left, width: initialPosition.width } : null,
  )

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (anchorRef.current) {
        const cell = anchorRef.current.closest('td')
        if (cell) {
          const rect = cell.getBoundingClientRect()
          setPosition({
            top: rect.top,
            left: rect.left,
            width: rect.width,
          })
        }
      }
    }

    if (!initialPosition) {
      updatePosition()
    }

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [initialPosition])

  return { anchorRef, position }
}
