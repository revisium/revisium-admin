import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { RowListItemType, RowListModel } from 'src/widgets/RowList/model/RowListModel.ts'
import { Cell } from 'src/widgets/RowList/ui/Cell/Cell.tsx'
import styles from 'src/widgets/RowList/ui/RowList/RowList.module.scss'

interface RowListItemProps {
  row: RowListItemType
  store: RowListModel
  onSelect?: (rowId: string) => void
}

export const SelectRowListItem2: React.FC<RowListItemProps> = ({ row, store, onSelect }) => {
  const handleClickOnRowId = useCallback(() => {
    onSelect?.(row.id)
  }, [onSelect, row.id])

  return (
    <Box
      height="40px"
      as="tr"
      _hover={{
        '& td': {
          bg: 'gray.50',
        },
      }}
      className={styles.Row}
      data-testid={`row-${row.id}`}
    >
      <Box as="td" position="sticky" left={0} backgroundColor="white">
        <Flex alignItems="center">
          <Text
            textDecoration="underline"
            cursor="pointer"
            onClick={handleClickOnRowId}
            data-testid={`row-${row.id}-select`}
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
          >
            {row.id}
          </Text>

          {!row.readonly && store.isEdit && <Text color="gray.400">*</Text>}
        </Flex>
      </Box>

      {row.cells.map((cell) => (
        <Cell isEdit={store.isEdit} store={cell} key={cell.nodeId} />
      ))}
    </Box>
  )
}
