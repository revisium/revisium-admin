import { observer } from 'mobx-react-lite'
import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { RowChangesListModel } from '../../model/RowChangesListModel'
import { RowChangeItemModel } from '../../model/RowChangeItemModel'
import { RowChangeListItem } from '../RowChangeListItem/RowChangeListItem'

interface RowChangesListProps {
  model: RowChangesListModel
  onRowClick?: (itemModel: RowChangeItemModel) => void
}

export const RowChangesList: React.FC<RowChangesListProps> = observer(({ model, onRowClick }) => {
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

        return <RowChangeListItem key={itemModel.rowId} model={itemModel} onClick={onRowClick} />
      }}
    />
  )
})
