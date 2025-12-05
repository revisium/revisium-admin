import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { RowItemViewModel } from 'src/widgets/RowList/model/RowItemViewModel'
import { Cell } from 'src/widgets/RowList/ui/Cell/Cell.tsx'
import styles from 'src/widgets/RowList/ui/RowList/RowList.module.scss'

interface SelectRowListItemProps {
  row: RowItemViewModel
  onSelect?: (rowId: string) => void
}

export const SelectRowListItem: React.FC<SelectRowListItemProps> = ({ row, onSelect }) => {
  const handleClickOnRowId = useCallback(() => {
    onSelect?.(row.id)
  }, [onSelect, row.id])

  const lastCellIndex = row.cells.length - 1

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
      <Box as="td" position="sticky" left={0} backgroundColor="white" width="200px" maxWidth="200px">
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

          {row.showModifiedIndicator && <Text color="gray.400">*</Text>}
        </Flex>
      </Box>

      {row.cells.map((cell, index) => (
        <Cell store={cell} key={cell.nodeId} isLastCell={lastCellIndex === index} />
      ))}

      <Box as="td" width="100%"></Box>
      <Box as="td"></Box>
    </Box>
  )
}
