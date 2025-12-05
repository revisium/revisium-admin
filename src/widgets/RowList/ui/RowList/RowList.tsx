import { Box, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { RowListViewModel } from 'src/widgets/RowList/model/RowListViewModel'
import { RowListEmptyState } from 'src/widgets/RowList/ui/RowListEmptyState/RowListEmptyState'
import { RowListItem } from 'src/widgets/RowList/ui/RowListItem/RowListItem'
import { SelectRowListItem } from 'src/widgets/RowList/ui/SelectRowListItem/SelectRowListItem'

interface RowListProps {
  model: RowListViewModel
  onSelect?: (rowId: string) => void
  onCopy?: (rowVersionId: string) => void
}

export const RowList: React.FC<RowListProps> = observer(({ model, onSelect, onCopy }) => {
  const isSelectMode = Boolean(onSelect)

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

  const { items, columns, showHeader } = model

  return (
    <TableVirtuoso
      style={{
        height: '100%',
      }}
      totalCount={items.length}
      defaultItemHeight={40}
      increaseViewportBy={40 * 100}
      endReached={model.hasNextPage ? model.tryToFetchNextPage : undefined}
      data={items}
      components={{
        Table: ({ style, ...props }) => {
          return (
            <table
              {...props}
              style={{
                ...style,
                width: 'max-content',
                minWidth: '100%',
              }}
            />
          )
        },
        TableRow: (props) => {
          const index = props['data-index']
          const row = items[index]

          return isSelectMode ? (
            <SelectRowListItem row={row} onSelect={onSelect} />
          ) : (
            <RowListItem row={row} onCopy={onCopy} />
          )
        },
      }}
      fixedHeaderContent={
        showHeader
          ? () => (
              <Box as="tr" height="40px">
                <Box
                  as="th"
                  backgroundColor="white"
                  position="sticky"
                  left={0}
                  zIndex={1}
                  width="140px"
                  maxWidth="140px"
                  minWidth="140px"
                >
                  <Box height="30px" borderBottomWidth="1px" borderColor="gray.100"></Box>
                </Box>
                {columns.map((column) => (
                  <Box
                    as="th"
                    textAlign="start"
                    key={column.id}
                    width={`${column.width}px`}
                    maxWidth={`${column.width}px`}
                    minWidth={`${column.width}px`}
                    backgroundColor="white"
                  >
                    <Text
                      pl="16px"
                      pr="16px"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      overflow="hidden"
                      height="30px"
                      borderBottomWidth="1px"
                      borderColor="gray.100"
                      color="gray.400"
                    >
                      {column.title}
                    </Text>
                  </Box>
                ))}
                <Box as="th" backgroundColor="white" width="100%">
                  <Box height="30px" borderBottomWidth="1px" borderColor="gray.100" />
                </Box>
                <Box as="th" backgroundColor="white" position="sticky" right={0} zIndex={1} width="40px">
                  <Box height="30px" borderBottomWidth="1px" borderColor="gray.100" />
                </Box>
              </Box>
            )
          : undefined
      }
    />
  )
})
