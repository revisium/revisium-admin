import { Box, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { RowListViewModel } from 'src/widgets/RowList/model/RowListViewModel'
import { HeaderContent } from './HeaderContent'
import { RowListContext } from './RowListContext'
import { RowListEmptyState } from 'src/widgets/RowList/ui/RowListEmptyState/RowListEmptyState'
import { RowListActionBar } from 'src/widgets/RowList/ui/RowListActionBar/RowListActionBar'
import { TableComponent } from './TableComponent'
import { TableRowComponent } from './TableRowComponent'

interface RowListProps {
  model: RowListViewModel
  onSelect?: (rowId: string) => void
  onCopy?: (rowVersionId: string) => void
}

const components = {
  Table: TableComponent,
  TableRow: TableRowComponent,
}

export const RowList: React.FC<RowListProps> = observer(({ model, onSelect, onCopy }) => {
  const isRowPickerMode = Boolean(onSelect)
  const { items, columnsModel, showHeader, selection, showSelectionColumn } = model

  const contextValue = useMemo(
    () => ({
      items,
      columnsModel,
      isRowPickerMode,
      onSelect,
      onCopy,
      selection,
      showSelectionColumn,
    }),
    [items, columnsModel, isRowPickerMode, onSelect, onCopy, selection, showSelectionColumn],
  )

  const fixedHeaderContent = useMemo(
    () => (showHeader ? () => <HeaderContent columnsModel={columnsModel} /> : undefined),
    [showHeader, columnsModel],
  )

  if (model.showLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Spinner size="lg" color="gray.400" />
      </Box>
    )
  }

  if (model.showError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Text color="red.500">Error loading rows</Text>
      </Box>
    )
  }

  if (model.showEmpty || model.showNotFound) {
    return <RowListEmptyState model={model} />
  }

  if (!model.showList) {
    return null
  }

  return (
    <RowListContext.Provider value={contextValue}>
      <TableVirtuoso
        style={{
          height: '100%',
        }}
        totalCount={items.length}
        defaultItemHeight={40}
        increaseViewportBy={40 * 100}
        endReached={model.hasNextPage ? model.tryToFetchNextPage : undefined}
        data={items}
        components={components}
        fixedHeaderContent={fixedHeaderContent}
      />
      <RowListActionBar model={model} />
    </RowListContext.Provider>
  )
})
