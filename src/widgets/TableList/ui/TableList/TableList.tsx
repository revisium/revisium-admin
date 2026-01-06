import { observer } from 'mobx-react-lite'
import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { useViewModel } from 'src/shared/lib/hooks/useViewModel.ts'
import { TableListModel } from 'src/widgets/TableList/model/TableListModel.ts'
import { TableListItem } from 'src/widgets/TableList/ui/TableListItem/TableListItem.tsx'

interface TableListProps {
  onSettings: (tableId: string) => void
  onCopy: (tableId: string) => void
  onSelect?: (tableId: string) => void
}

export const TableList: React.FC<TableListProps> = observer(({ onSettings, onCopy, onSelect }) => {
  const store = useViewModel(TableListModel)

  return (
    <Virtuoso
      useWindowScroll
      totalCount={store.totalCount}
      defaultItemHeight={40}
      increaseViewportBy={40 * 100}
      endReached={store.hasNextPage ? store.tryToFetchNextPage : undefined}
      itemContent={(index) => {
        const item = store.items[index]

        if (!item) {
          return undefined
        }

        return (
          <TableListItem
            key={item.versionId}
            item={item}
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
