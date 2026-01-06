import { Box, Flex, Menu, Portal, Text, useDisclosure } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { PiCopy, PiGear, PiTrash } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { DotsThreeButton, toaster } from 'src/shared/ui'
import { TableListItemViewModel } from 'src/widgets/TableList/model/TableListItemViewModel.ts'
import { TableListModel } from 'src/widgets/TableList/model/TableListModel.ts'
import styles from 'src/widgets/TableList/ui/TableList/TableList.module.scss'

interface TableListItemProps {
  item: TableListItemViewModel
  store: TableListModel
  onSettings: (tableId: string) => void
  onCopy: (tableId: string) => void
  onSelect?: (tableId: string) => void
}

export const TableListItem: React.FC<TableListItemProps> = observer(({ item, store, onSettings, onCopy, onSelect }) => {
  const { open: menuOpen, setOpen } = useDisclosure()

  const handleSettings = useCallback(async () => {
    onSettings(item.id)
  }, [onSettings, item.id])

  const handleRemove = useCallback(async () => {
    const result = await store.removeTable(item.id)
    if (!result) {
      toaster.error({ title: 'Failed to remove table' })
    }
  }, [store, item.id])

  const handleCopy = useCallback(() => {
    onCopy(item.id)
  }, [onCopy, item.id])

  const handleClickOnTableId = useCallback(() => {
    onSelect?.(item.id)
  }, [onSelect, item.id])

  const isSelectMode = Boolean(onSelect)

  return (
    <Box height="2.5rem" key={item.versionId} width="100%" data-testid={`table-${item.id}`}>
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
              data-testid={`table-${item.id}-select`}
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {item.id}
            </Text>
          ) : (
            <Link to={`${item.id}`} data-testid={`table-${item.id}-link`}>
              <Text
                maxWidth="140px"
                textDecoration="underline"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {item.id}
              </Text>
            </Link>
          )}
          {!item.readonly && store.isEditableRevision && <Text>*</Text>}
        </Flex>
        <Flex alignItems="center" flex={1} justifyContent="space-between" minHeight="40px">
          <Text color="gray.400" fontWeight="300" ml="16px">
            {item.count} rows
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
                    <DotsThreeButton dataTestId={`table-list-menu-${item.id}`} />
                  </Box>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {store.canUpdateTable && (
                        <Menu.Item
                          color="gray.600"
                          value="edit-schema"
                          data-testid={`edit-schema-button-${item.id}`}
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
                          data-testid={`copy-table-button-${item.id}`}
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
                          data-testid={`remove-table-button-${item.id}`}
                          onClick={handleRemove}
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
})
