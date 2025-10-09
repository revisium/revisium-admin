import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { RootValueNode } from 'src/widgets/TreeDataCard'
import { nodeRendererRegistry } from './renderers'

export interface TreeDataCardWidgetProps {
  store: RootValueNode
  isEdit?: boolean
}

export const TreeDataCardWidget: React.FC<TreeDataCardWidgetProps> = observer(({ store, isEdit = false }) => {
  const renderer = useCallback(
    (index: number) => {
      const node = store.flattenedNodes[index]

      return nodeRendererRegistry.render({
        node,
        isEdit,
      })
    },
    [store.flattenedNodes, isEdit],
  )

  return (
    <Virtuoso
      style={{ width: '100%', height: `${store.flattenedNodes.length * 28}px` }}
      useWindowScroll
      totalCount={store.flattenedNodes.length}
      itemContent={renderer}
      overscan={10}
    />
  )
})
