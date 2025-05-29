import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/drag-and-drop/adapter/element'
import { CleanupFn } from '@atlaskit/drag-and-drop/types'
import { useEffect, useRef, useState } from 'react'
import { isProperDrop } from 'src/widgets/SchemaEditor/lib/isProperDrop.ts'
import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'

export const useDragAndDrop = (store: SchemaNode, isDraggable: boolean, handleDrop: (node) => void) => {
  const dragAndDropRef = useRef<HTMLDivElement | null>(null)
  const [isDrop, setIsDrop] = useState(false)
  const [isDisabledDrop, setIsDisabledDrop] = useState(false)
  const [isDraggedOver, setIsDraggedOver] = useState(false)

  useEffect(() => {
    let cleanup: CleanupFn | null = null

    if (isDraggable) {
      if (!dragAndDropRef.current) {
        return
      }

      cleanup = draggable({
        element: dragAndDropRef.current,
        getInitialData: () => ({ store }),
      })
    }

    return () => cleanup?.()
  }, [store, isDraggable])

  useEffect(() => {
    if (!dragAndDropRef.current) {
      return
    }

    let cleanup: CleanupFn | null = null

    if (store instanceof ObjectNodeStore || store instanceof ArrayNodeStore) {
      cleanup = dropTargetForElements({
        element: dragAndDropRef.current,
        onDrop: (e) => {
          const draggingNode = e.source.data.store as unknown as SchemaNode

          if (isProperDrop(store, draggingNode)) {
            handleDrop(draggingNode)
          }

          setIsDraggedOver(false)
          setIsDrop(false)
        },
        onDragEnter: (e) => {
          const draggingNode = e.source.data.store as unknown as SchemaNode
          setIsDraggedOver(isProperDrop(store, draggingNode))
        },
        onDragLeave: () => setIsDraggedOver(false),
      })
    }

    return () => cleanup?.()
  }, [handleDrop, store])

  useEffect(() => {
    return monitorForElements({
      onDragStart: (e) => {
        const draggingNode = e.source.data.store as unknown as SchemaNode

        if (store instanceof ObjectNodeStore || store instanceof ArrayNodeStore) {
          const check = isProperDrop(store, draggingNode)

          if (check) {
            setIsDrop(isProperDrop(store, draggingNode))
          } else {
            setIsDisabledDrop(true)
          }
        } else {
          setIsDisabledDrop(true)
        }
      },
      onDrop: () => {
        setIsDrop(false)
        setIsDisabledDrop(false)
      },
    })
  }, [store])

  return {
    dragAndDropRef,
    isDrop,
    isDisabledDrop,
    isDraggedOver,
  }
}
