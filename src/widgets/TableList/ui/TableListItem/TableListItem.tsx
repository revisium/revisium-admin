import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { RemoveTableButton } from 'src/features/RemoveTableButton'
import { SettingsButton } from 'src/features/SettingsButton/ui/SettingsButton/SettingsButton.tsx'
import { CopyButton } from 'src/shared/ui/CopyButton/CopyButton.tsx'
import { TableListItemType } from 'src/widgets/TableList/config/types.ts'
import { TableListModel } from 'src/widgets/TableList/model/TableListModel.ts'
import styles from 'src/widgets/TableList/ui/TableList/TableList.module.scss'

interface TableListItemProps {
  table: TableListItemType
  store: TableListModel
  onSettings: (tableVersionId: string) => void
  onCopy: (tableVersionId: string) => void
  onSelect?: (tableId: string) => void
}

export const TableListItem: React.FC<TableListItemProps> = ({ table, store, onSettings, onCopy, onSelect }) => {
  const handleSettings = useCallback(async () => {
    onSettings(table.versionId)
  }, [onSettings, table.versionId])

  const handleDelete = useCallback(() => {
    return store.deleteTable(table.id)
  }, [store, table.id])

  const handleCopy = useCallback(() => {
    onCopy(table.versionId)
  }, [onCopy, table.versionId])

  const handleClickOnTableId = useCallback(() => {
    onSelect?.(table.id)
  }, [onSelect, table.id])

  const isSelectMode = Boolean(onSelect)

  return (
    <Box height="2.5rem" key={table.versionId} width="100%" data-testid={`table-${table.id}`}>
      <Flex
        _hover={{ backgroundColor: 'gray.50' }}
        alignItems="center"
        className={styles.Row}
        gap="4px"
        paddingLeft="1rem"
      >
        <Flex width="150px">
          {onSelect ? (
            <Text
              maxWidth="140px"
              textDecoration="underline"
              cursor="pointer"
              onClick={handleClickOnTableId}
              data-testid={`table-${table.id}-select`}
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {table.id}
            </Text>
          ) : (
            <Link to={`${table.id}`} data-testid={`table-${table.id}-link`}>
              <Text
                maxWidth="140px"
                textDecoration="underline"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {table.id}
              </Text>
            </Link>
          )}
          {!table.readonly && store.isEditableRevision && <Text>*</Text>}
        </Flex>
        <Flex alignItems="center" flex={1} justifyContent="space-between" minHeight="40px">
          <Text color="gray.400" fontWeight="300" ml="16px">
            {table.count} rows
          </Text>
          {!isSelectMode && store.isEditableRevision && (
            <Flex className={styles.RemoveRowButton}>
              <SettingsButton dataTestId={`table-settings-button-${table.id}`} onClick={handleSettings} />
              <CopyButton aria-label="" dataTestId={`copy-table-button-${table.id}`} onClick={handleCopy} />
              <RemoveTableButton dataTestId={`remove-table-button-${table.id}`} onRemove={handleDelete} />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
