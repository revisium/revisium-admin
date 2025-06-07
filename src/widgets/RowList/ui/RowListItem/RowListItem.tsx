import { Box, Flex, Menu, Portal, Text, useDisclosure } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { PiCopy, PiTrash } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { DotsThreeButton } from 'src/shared/ui'
import { RowListItemType, RowListModel } from 'src/widgets/RowList/model/RowListModel.ts'
import styles from 'src/widgets/RowList/ui/RowList/RowList.module.scss'

interface RowListItemProps {
  row: RowListItemType
  store: RowListModel
  onSelect?: (rowId: string) => void
  onCopy?: (rowVersionId: string) => void
}

export const RowListItem: React.FC<RowListItemProps> = ({ row, store, onCopy, onSelect }) => {
  const { open: menuOpen, setOpen } = useDisclosure()

  const handleClickOnRowId = useCallback(() => {
    onSelect?.(row.id)
  }, [onSelect, row.id])

  const handleCopyRow = useCallback(() => {
    onCopy?.(row.versionId)
  }, [onCopy, row.versionId])

  const handleDeleteRow = useCallback(async () => {
    await store.deleteRow(row.id)
  }, [row.id, store])

  const isSelectMode = Boolean(onSelect)

  return (
    <Flex
      _hover={{ backgroundColor: 'gray.50' }}
      backgroundColor={menuOpen ? 'gray.50' : undefined}
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
                  <DotsThreeButton dataTestId={`row-list-menu-${row.id}`} />
                </Box>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item color="gray.600" value="copy" data-testid={`copy-row-${row.id}`} onClick={handleCopyRow}>
                      <PiCopy />
                      <Box flex="1">Duplicate</Box>
                    </Menu.Item>
                    <Menu.Item
                      color="gray.600"
                      value="delete"
                      data-restid={`remove-row-${row.id}`}
                      onClick={handleDeleteRow}
                    >
                      <PiTrash />
                      <Box flex={1}>Delete</Box>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
