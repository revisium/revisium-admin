import { Flex, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { RowListItemType, RowListModel } from 'src/widgets/RowList/model/RowListModel.ts'
import styles from 'src/widgets/RowList/ui/RowList/RowList.module.scss'

interface RowListItemProps {
  row: RowListItemType
  store: RowListModel
  onSelect?: (rowId: string) => void
}

export const SelectRowListItem: React.FC<RowListItemProps> = ({ row, store, onSelect }) => {
  const handleClickOnRowId = useCallback(() => {
    onSelect?.(row.id)
  }, [onSelect, row.id])

  return (
    <Flex
      _hover={{ backgroundColor: 'gray.50' }}
      alignItems="center"
      className={styles.Row}
      key={row.versionId}
      gap="4px"
      paddingLeft="1rem"
      minHeight="2.5rem"
      width="100%"
      data-testid={`row-${row.id}`}
    >
      <Flex width="150px">
        <Text
          maxWidth="140px"
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

      <Flex alignItems="center" justifyContent="space-between" minHeight="40px" width="100%" minWidth={0}>
        <Text ml="16px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" color="gray.400" fontWeight="300">
          {row.data}
        </Text>
      </Flex>
    </Flex>
  )
}
