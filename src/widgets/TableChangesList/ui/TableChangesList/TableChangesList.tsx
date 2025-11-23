import { observer } from 'mobx-react-lite'
import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { TableChangesListModel } from '../../model/TableChangesListModel'
import { TableChangeItemModel } from '../../model/TableChangeItemModel'
import { TableChangeListItem } from '../TableChangeListItem/TableChangeListItem'

interface TableChangesListProps {
  model: TableChangesListModel
  onTableClick?: (model: TableChangeItemModel) => void
}

export const TableChangesList: React.FC<TableChangesListProps> = observer(({ model, onTableClick }) => {
  return (
    <Virtuoso
      useWindowScroll
      totalCount={model.itemModels.length}
      defaultItemHeight={60}
      increaseViewportBy={60 * 100}
      endReached={model.hasNextPage ? () => model.tryToFetchNextPage() : undefined}
      itemContent={(index) => {
        const itemModel = model.itemModels[index]

        if (!itemModel) {
          return undefined
        }

        return <TableChangeListItem key={itemModel.tableId} model={itemModel} onClick={onTableClick} />
      }}
    />
  )
})
