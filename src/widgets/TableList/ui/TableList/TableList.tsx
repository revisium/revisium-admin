import { observer } from 'mobx-react-lite'
import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { useTableListModel } from 'src/widgets/TableList/hooks/useTableListModel.ts'
import { TableListItem } from 'src/widgets/TableList/ui/TableListItem/TableListItem.tsx'

interface TableListProps {
  onSettings: (tableVersionId: string) => void
  onCopy: (tableVersionId: string) => void
  onSelect?: (tableId: string) => void
}

export const TableList: React.FC<TableListProps> = observer(({ onSettings, onCopy, onSelect }) => {
  const store = useTableListModel()

  return (
    <Virtuoso
      useWindowScroll
      totalCount={store.totalCount}
      defaultItemHeight={40}
      increaseViewportBy={40 * 100}
      endReached={store.hasNextPage ? store.tryToFetchNextPage : undefined}
      itemContent={(index) => {
        const table = store.items[index]

        if (!table) {
          return undefined
        }

        return (
          <TableListItem
            key={table.versionId}
            table={table}
            store={store}
            onSettings={onSettings}
            onCopy={onCopy}
            onSelect={onSelect}
          />
        )
      }}
    />
  )
})
