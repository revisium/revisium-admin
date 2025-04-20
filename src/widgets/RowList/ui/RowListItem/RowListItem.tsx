import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { RemoveRowButton } from 'src/features/RemoveRowButton'
import { RowListItemType, RowListModel } from 'src/widgets/RowList/model/RowListModel.ts'
import styles from 'src/widgets/RowList/ui/RowList/RowList.module.scss'

interface RowListItemProps {
  row: RowListItemType
  store: RowListModel
  onSelect?: (rowId: string) => void
}

export const RowListItem: React.FC<RowListItemProps> = ({ row, store, onSelect }) => {
  const handleClickOnRowId = useCallback(() => {
    onSelect?.(row.id)
  }, [onSelect, row.id])

  const isSelectMode = Boolean(onSelect)

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
        {onSelect ? (
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
        ) : (
          <Link to={`${row.id}`} data-testid={`row-${row.id}-link`}>
            <Text
              maxWidth="140px"
              color="gray.400"
              textDecoration="underline"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {row.id}
            </Text>
          </Link>
        )}

        {!row.readonly && store.isEdit && <Text color="gray.400">*</Text>}
      </Flex>

      <Flex alignItems="center" justifyContent="space-between" minHeight="40px" width="100%" minWidth={0}>
        <Text ml="16px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" color="gray.400" fontWeight="300">
          {row.data}
        </Text>
        {!isSelectMode && store.isEdit && (
          <Box className={styles.RemoveRowButton}>
            <RemoveRowButton rowId={row.id} onRemove={store.deleteRow} dataTestId={`remove-row-${row.id}`} />
          </Box>
        )}
      </Flex>
    </Flex>
  )
}
