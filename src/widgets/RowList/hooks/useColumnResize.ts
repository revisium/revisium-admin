import { useCallback, useEffect, useRef, useState } from 'react'
import { MIN_COLUMN_WIDTH } from 'src/widgets/RowList/config/constants'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'

export const useColumnResize = (columnId: string, columnsModel: ColumnsModel) => {
  const [isResizing, setIsResizing] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)

  const columnIdRef = useRef(columnId)
  const columnsModelRef = useRef(columnsModel)
  columnIdRef.current = columnId
  columnsModelRef.current = columnsModel

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const currentWidth = columnsModelRef.current.getColumnWidth(columnIdRef.current)
    startXRef.current = e.clientX
    startWidthRef.current = currentWidth
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (rafIdRef.current !== null) return

      rafIdRef.current = requestAnimationFrame(() => {
        const delta = e.clientX - startXRef.current
        const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidthRef.current + delta)
        columnsModelRef.current.setColumnWidth(columnIdRef.current, newWidth)
        rafIdRef.current = null
      })
    }

    const handleMouseUp = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [isResizing])

  return {
    isResizing,
    handleMouseDown,
  }
}
