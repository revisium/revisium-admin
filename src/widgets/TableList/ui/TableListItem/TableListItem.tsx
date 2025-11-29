import { Box, Flex, Menu, Portal, Text, useDisclosure } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { PiCopy, PiGear, PiTrash } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { DotsThreeButton } from 'src/shared/ui'
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
  const { open: menuOpen, setOpen } = useDisclosure()

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
        backgroundColor={menuOpen ? 'gray.50' : undefined}
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
          {!isSelectMode && store.showMenu && (
            <Flex className={!menuOpen ? styles.Actions : undefined}>
              <Menu.Root
                positioning={{
                  placement: 'bottom-start',
                }}
                open={menuOpen}
                onOpenChange={(e) => {
                  setOpen(e.open)
                }}
              >
                <Menu.Trigger>
                  <Box paddingRight="2px">
                    <DotsThreeButton dataTestId={`table-list-menu-${table.id}`} />
                  </Box>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {store.canUpdateTable && (
                        <Menu.Item
                          color="gray.600"
                          value="edit-schema"
                          data-testid={`edit-schema-button-${table.id}`}
                          onClick={handleSettings}
                        >
                          <PiGear />
                          <Box flex="1">Edit schema</Box>
                        </Menu.Item>
                      )}
                      {store.canCreateTable && (
                        <Menu.Item
                          color="gray.600"
                          value="copy"
                          data-testid={`copy-table-button-${table.id}`}
                          onClick={handleCopy}
                        >
                          <PiCopy />
                          <Box flex="1">Copy schema</Box>
                        </Menu.Item>
                      )}
                      {store.canDeleteTable && (
                        <Menu.Item
                          color="gray.600"
                          value="delete"
                          data-restid={`remove-table-button-${table.id}`}
                          onClick={handleDelete}
                        >
                          <PiTrash />
                          <Box flex={1}>Delete</Box>
                        </Menu.Item>
                      )}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
