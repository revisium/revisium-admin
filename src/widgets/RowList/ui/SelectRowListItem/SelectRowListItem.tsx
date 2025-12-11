import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { RowItemViewModel } from 'src/widgets/RowList/model/RowItemViewModel'
import { CellsRow } from 'src/widgets/RowList/ui/CellsRow/CellsRow'
import styles from 'src/widgets/RowList/ui/RowList/RowList.module.scss'

interface SelectRowListItemProps {
  row: RowItemViewModel
  columnsModel: ColumnsModel
  revisionId: string
  onSelect?: (rowId: string) => void
}

export const SelectRowListItem: React.FC<SelectRowListItemProps> = observer(
  ({ row, columnsModel, revisionId, onSelect }) => {
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
        <Box as="td" position="sticky" left={0} backgroundColor="white" width="200px" minWidth="200px" maxWidth="200px">
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
          <Box position="absolute" right={0} top={0} bottom={0} width="1px" bg="gray.100" />
        </Box>

        <CellsRow row={row} columnsModel={columnsModel} revisionId={revisionId} />

        <Box as="td" width="100%"></Box>
        <Box as="td"></Box>
      </Box>
    )
  },
)
