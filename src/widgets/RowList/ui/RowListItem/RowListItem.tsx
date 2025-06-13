import { Box, Flex, Menu, Portal, Text, useDisclosure } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { PiCopy, PiTrash } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { ItemProps } from 'react-virtuoso'
import { DotsThreeButton } from 'src/shared/ui'
import { RowListItemType, RowListModel } from 'src/widgets/RowList/model/RowListModel.ts'
import { Cell } from 'src/widgets/RowList/ui/Cell/Cell.tsx'
import styles from 'src/widgets/RowList/ui/RowList/RowList.module.scss'

interface RowListItemProps {
  trProps: ItemProps<unknown>
  row: RowListItemType
  store: RowListModel
  onCopy?: (rowVersionId: string) => void
}

export const RowListItem: React.FC<RowListItemProps> = ({ trProps, row, store, onCopy }) => {
  const { open: menuOpen, setOpen } = useDisclosure()

  const handleCopyRow = useCallback(() => {
    onCopy?.(row.versionId)
  }, [onCopy, row.versionId])

  const handleDeleteRow = useCallback(async () => {
    await store.deleteRow(row.id)
  }, [row.id, store])

  return (
    <Flex
      {...trProps}
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
      as="tr"
    >
      <Flex minWidth="150px" width="150px" as="td">
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

        {!row.readonly && store.isEdit && <Text color="gray.400">*</Text>}
      </Flex>

      {row.cells.map((cell) => (
        <Cell store={cell} key={cell?.nodeId} />
      ))}

      {store.isEdit && (
        <Flex className={!menuOpen ? styles.Actions : undefined} as="td" width="100%" justifyContent="flex-end">
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
  )
}
