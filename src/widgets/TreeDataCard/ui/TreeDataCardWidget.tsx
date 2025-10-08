import { observer } from 'mobx-react-lite'
import React, { useMemo, useCallback } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store'
import { buildTreeStore } from 'src/widgets/TreeDataCard/lib/buildTreeStore.ts'
import { nodeRendererRegistry } from './renderers'

export interface TreeDataCardWidgetProps {
  store: RowDataCardStore
  isEdit?: boolean
}

export const TreeDataCardWidget: React.FC<TreeDataCardWidgetProps> = observer(({ store, isEdit = false }) => {
  const tree = useMemo(() => buildTreeStore(store), [store])
  const flattenedNodes = tree.flattenedNodes

  const renderer = useCallback(
    (index: number) => {
      const node = flattenedNodes[index]

      return nodeRendererRegistry.render({
        node,
        isEdit,
      })
    },
    [flattenedNodes, isEdit],
  )

  return (
    <Virtuoso
      style={{ width: '100%', height: `${flattenedNodes.length * 28}px` }}
      useWindowScroll
      totalCount={flattenedNodes.length}
      itemContent={renderer}
      overscan={10}
    />
  )
})
