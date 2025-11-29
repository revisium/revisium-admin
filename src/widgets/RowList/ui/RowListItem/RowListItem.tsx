import { Box, Flex, Menu, Portal, Text, useDisclosure } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { PiCopy, PiTrash } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { DotsThreeButton } from 'src/shared/ui'
import { RowListItemType, RowListModel } from 'src/widgets/RowList/model/RowListModel.ts'
import { Cell } from 'src/widgets/RowList/ui/Cell/Cell.tsx'
import styles from 'src/widgets/RowList/ui/RowList/RowList.module.scss'

interface RowListItem2Props {
  row: RowListItemType
  store: RowListModel
  onCopy?: (rowVersionId: string) => void
}

export const RowListItem: React.FC<RowListItem2Props> = ({ row, store, onCopy }) => {
  const { open: menuOpen, setOpen } = useDisclosure()

  const handleCopyRow = useCallback(() => {
    onCopy?.(row.versionId)
  }, [onCopy, row.versionId])

  const handleDeleteRow = useCallback(async () => {
    await store.deleteRow(row.id)
  }, [row.id, store])

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
      bg="white"
      className={styles.Row}
      data-testid={`row-${row.id}`}
    >
      <Box
        as="td"
        position="sticky"
        left={0}
        zIndex={1}
        backgroundColor="white"
        width="200px"
        maxWidth="200px"
        pl="8px"
        pr="24px"
      >
        <Flex alignItems="center">
          <Text textDecoration="underline" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
            <Link to={`${row.id}`} data-testid={`row-${row.id}-link`}>
              {row.id}
            </Link>
          </Text>
          {!row.readonly && store.isEdit && <Text color="gray.400">*</Text>}
        </Flex>
      </Box>

      {row.cells.map((cell, index) => (
        <Cell store={cell} key={cell.nodeId} isLastCell={lastCellIndex === index} />
      ))}

      <Box as="td" width="100%"></Box>
      {store.showMenu && (
        <Box
          className={!menuOpen ? styles.Actions : undefined}
          as="td"
          position="sticky"
          right={0}
          zIndex={1}
          backgroundColor="white"
          width="40px"
        >
          <Flex justifyContent="flex-end">
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
                    {store.canCreateRow && (
                      <Menu.Item
                        color="gray.600"
                        value="copy"
                        data-testid={`copy-row-${row.id}`}
                        onClick={handleCopyRow}
                      >
                        <PiCopy />
                        <Box flex="1">Duplicate</Box>
                      </Menu.Item>
                    )}
                    {store.canDeleteRow && (
                      <Menu.Item
                        color="gray.600"
                        value="delete"
                        data-restid={`remove-row-${row.id}`}
                        onClick={handleDeleteRow}
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
        </Box>
      )}
    </Box>
  )
}
