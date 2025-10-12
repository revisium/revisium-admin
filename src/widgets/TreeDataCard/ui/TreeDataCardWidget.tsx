import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { RootValueNode } from 'src/widgets/TreeDataCard'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'
import { nodeRendererRegistry } from './renderers'

export interface TreeDataCardWidgetProps {
  store: RootValueNode
  isEdit?: boolean
}

export const TreeDataCardWidget: React.FC<TreeDataCardWidgetProps> = observer(({ store, isEdit = false }) => {
  const renderer = useCallback(
    (_: number, node: BaseValueNode) => {
      return nodeRendererRegistry.render({
        node,
        isEdit,
      })
    },
    [isEdit],
  )

  return (
    <Virtuoso
      style={{ width: '100%', marginBottom: '8rem' }}
      useWindowScroll
      totalCount={store.flattenedNodes.length}
      data={store.flattenedNodes}
      itemContent={renderer}
      overscan={10}
    />
  )
})
