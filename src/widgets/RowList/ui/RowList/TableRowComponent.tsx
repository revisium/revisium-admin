import React, { useContext } from 'react'
import { RowListItem } from 'src/widgets/RowList/ui/RowListItem/RowListItem'
import { SelectRowListItem } from 'src/widgets/RowList/ui/SelectRowListItem/SelectRowListItem'
import { RowListContext } from './RowListContext'

interface TableRowProps {
  'data-index': number
}

export const TableRowComponent: React.FC<TableRowProps> = ({ 'data-index': index }) => {
  const context = useContext(RowListContext)
  if (!context) return null

  const { items, columnsModel, isRowPickerMode, onSelect, onCopy, selection, showSelectionColumn } = context
  const row = items[index]

  if (!row) return null

  return isRowPickerMode ? (
    <SelectRowListItem row={row} columnsModel={columnsModel} onSelect={onSelect} />
  ) : (
    <RowListItem
      row={row}
      columnsModel={columnsModel}
      onCopy={onCopy}
      selection={selection}
      showSelectionColumn={showSelectionColumn}
    />
  )
}
