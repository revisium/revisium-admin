import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { RowListItem } from 'src/widgets/RowList/ui/RowListItem/RowListItem'
import { SelectRowListItem } from 'src/widgets/RowList/ui/SelectRowListItem/SelectRowListItem'
import { RowListContext } from './RowListContext'

interface TableRowProps {
  'data-index': number
}

export const TableRowComponent: React.FC<TableRowProps> = observer(({ 'data-index': index }) => {
  const context = useContext(RowListContext)
  if (!context) {
    return null
  }

  const { model, revisionId, tableId, isRevisionReadonly, isRowPickerMode, onSelect, onCopy } = context
  const { items, columnsModel, selection, showSelectionColumn } = model
  const row = items[index]

  if (!row) {
    return null
  }

  if (isRowPickerMode) {
    return <SelectRowListItem row={row} columnsModel={columnsModel} revisionId={revisionId} onSelect={onSelect} />
  }

  return (
    <RowListItem
      row={row}
      columnsModel={columnsModel}
      revisionId={revisionId}
      tableId={tableId}
      isRevisionReadonly={isRevisionReadonly}
      onCopy={onCopy}
      selection={selection}
      showSelectionColumn={showSelectionColumn}
    />
  )
})
