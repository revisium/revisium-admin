import { observer } from 'mobx-react-lite'
import React from 'react'
import { TableVirtuoso } from 'react-virtuoso'
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
    <TableVirtuoso
      useWindowScroll
      totalCount={store.totalCount}
      defaultItemHeight={40}
      increaseViewportBy={40 * 100}
      endReached={store.hasNextPage ? store.tryToFetchNextPage : undefined}
      components={{
        Table: ({ style, ...props }) => {
          return (
            <table
              {...props}
              style={{
                ...style,
                width: '100%',
                tableLayout: 'fixed',
                borderCollapse: 'collapse',
                borderSpacing: 0,
              }}
            />
          )
        },
        TableRow: (props) => {
          const index = props['data-index']
          const row = store.items[index]

          if (!row) {
            return undefined
          }

          return isSelectMode ? (
            <SelectRowListItem row={row} store={store} onSelect={onSelect} />
          ) : (
            <RowListItem trProps={props} row={row} store={store} onCopy={onCopy} />
          )
        },
      }}
    />
  )
})
