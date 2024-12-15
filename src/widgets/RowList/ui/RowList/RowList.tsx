import { observer } from 'mobx-react-lite'
import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { ITableModel } from 'src/shared/model/BackendStore'
import { useRowListModel } from 'src/widgets/RowList/hooks/useRowListModel.ts'
import { RowListItem } from 'src/widgets/RowList/ui/RowListItem/RowListItem.tsx'

interface RowListProps {
  table: ITableModel
  onSelect?: (rowId: string) => void
}

export const RowList: React.FC<RowListProps> = observer(({ table, onSelect }) => {
  const store = useRowListModel(table)

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

        return <RowListItem row={row} store={store} onSelect={onSelect} />
      }}
    />
  )
})
