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
import { useInlineEditKeyboard } from 'src/widgets/RowList/hooks/useInlineEditKeyboard'

interface RowListProps {
  model: RowListViewModel
  revisionId: string
  tableId: string
  isRevisionReadonly?: boolean
  onSelect?: (rowId: string) => void
  onCopy?: (rowVersionId: string) => void
}

const components = {
  Table: TableComponent,
  TableRow: TableRowComponent,
}

export const RowList: React.FC<RowListProps> = observer(
  ({ model, revisionId, tableId, isRevisionReadonly = false, onSelect, onCopy }) => {
    const isRowPickerMode = Boolean(onSelect)
    const { items, columnsModel, inlineEdit, showHeader } = model

    useInlineEditKeyboard({
      inlineEditModel: inlineEdit,
      enabled: !isRowPickerMode,
    })

    const contextValue = useMemo(
      () => ({
        model,
        revisionId,
        tableId,
        isRevisionReadonly,
        isRowPickerMode,
        onSelect,
        onCopy,
      }),
      [model, revisionId, tableId, isRevisionReadonly, isRowPickerMode, onSelect, onCopy],
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
  },
)
