import { Box, Text } from '@chakra-ui/react'
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

  const { columns, data, showHeader } = store.columns

  return (
    <TableVirtuoso
      style={{
        height: '100%',
      }}
      totalCount={store.totalCount}
      defaultItemHeight={40}
      increaseViewportBy={40 * 100}
      endReached={store.hasNextPage ? store.tryToFetchNextPage : undefined}
      data={data}
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
          const row = data[index]

          return isSelectMode ? (
            <SelectRowListItem row={row} store={store} onSelect={onSelect} />
          ) : (
            <RowListItem row={row} store={store} onCopy={onCopy} />
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
                <Box as="th" backgroundColor="white" position="sticky" right={0} zIndex={0} width="100%">
                  <Box height="30px" borderBottomWidth="1px" borderColor="gray.100" />
                </Box>
              </Box>
            )
          : undefined
      }
    />
  )
})
