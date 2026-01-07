import { Box, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo } from 'react'
import { TableVirtuoso, TableVirtuosoHandle } from 'react-virtuoso'
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
  onCopy?: (rowId: string) => void
  onCreate?: () => void
}

const components = {
  Table: TableComponent,
  TableRow: TableRowComponent,
}

export const RowList: React.FC<RowListProps> = observer(
  ({ model, revisionId, tableId, isRevisionReadonly = false, onSelect, onCopy, onCreate }) => {
    const isRowPickerMode = Boolean(onSelect)
    const { items, columnsModel, inlineEdit, showHeader } = model

    const virtuosoRef = useCallback(
      (ref: TableVirtuosoHandle | null) => {
        model.setVirtuosoRef(ref)
      },
      [model],
    )

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

    const LoadingMoreFooter = useCallback(
      () =>
        model.isLoadingMore ? (
          <Box display="flex" justifyContent="center" alignItems="center" py="16px">
            <Spinner size="sm" color="gray.400" />
          </Box>
        ) : null,
      [model.isLoadingMore],
    )

    const tableComponents = useMemo(
      () => ({
        ...components,
        Footer: LoadingMoreFooter,
      }),
      [LoadingMoreFooter],
    )

    if (model.showLoading) {
      return (
        <Box display="flex" flexDirection="column" height="100%">
          <Box display="flex" flex={1} justifyContent="center" alignItems="center">
            <Spinner size="lg" color="gray.400" />
          </Box>
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

    if (model.showEmpty) {
      return (
        <Box display="flex" flexDirection="column" height="100%">
          <RowListEmptyState model={model} onCreate={onCreate} />
        </Box>
      )
    }

    if (model.showNotFound) {
      return (
        <RowListContext.Provider value={contextValue}>
          <Box display="flex" flexDirection="column" height="100%">
            <Box overflowX="auto">
              <table
                style={{ width: 'max-content', minWidth: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}
              >
                <Box as="thead" position="sticky" top={0} zIndex={2} bg="white">
                  <HeaderContent columnsModel={columnsModel} />
                </Box>
              </table>
            </Box>
            <RowListEmptyState model={model} onCreate={onCreate} />
          </Box>
        </RowListContext.Provider>
      )
    }

    if (!model.showList) {
      return null
    }

    return (
      <RowListContext.Provider value={contextValue}>
        <TableVirtuoso
          ref={virtuosoRef}
          style={{
            height: '100%',
          }}
          totalCount={items.length}
          defaultItemHeight={40}
          increaseViewportBy={40 * 100}
          endReached={model.hasNextPage ? model.tryToFetchNextPage : undefined}
          data={items}
          components={tableComponents}
          fixedHeaderContent={fixedHeaderContent}
        />
        <RowListActionBar model={model} />
      </RowListContext.Provider>
    )
  },
)
