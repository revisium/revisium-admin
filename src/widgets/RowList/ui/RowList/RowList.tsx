import { observer } from 'mobx-react-lite'
import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { ITableModel } from 'src/shared/model/BackendStore'
import { useRowListModel } from 'src/widgets/RowList/hooks/useRowListModel.ts'
import { RowListItem } from 'src/widgets/RowList/ui/RowListItem/RowListItem.tsx'
import { SelectRowListItem } from 'src/widgets/RowList/ui/SelectRowListItem/SelectRowListItem.tsx'

interface RowListProps {
  table: ITableModel
  onSelect?: (rowId: string) => void
  onCopy?: (rowVersionId: string) => void
}

export const RowList: React.FC<RowListProps> = observer(({ table, onSelect, onCopy }) => {
  const store = useRowListModel(table)

  const isSelectMode = Boolean(onSelect)

  return (
    <Virtuoso
      useWindowScroll
      totalCount={store.totalCount}
      defaultItemHeight={40}
      increaseViewportBy={40 * 100}
      endReached={store.hasNextPage ? store.tryToFetchNextPage : undefined}
      itemContent={(index) => {
        const row = store.items[index]

        if (!row) {
          return undefined
        }

        return isSelectMode ? (
          <SelectRowListItem row={row} store={store} onSelect={onSelect} />
        ) : (
          <RowListItem row={row} store={store} onCopy={onCopy} />
        )
      }}
    />
  )
})
