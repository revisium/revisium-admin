import { Box, Checkbox, Flex, Menu, Portal, Text, useDisclosure } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { PiCheckSquare, PiCopy, PiTrash } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { useFileUpload } from 'src/shared/lib'
import { DotsThreeButton } from 'src/shared/ui'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { RowItemViewModel } from 'src/widgets/RowList/model/RowItemViewModel'
import { SelectionViewModel } from 'src/widgets/RowList/model/SelectionViewModel'
import { CellsRow } from 'src/widgets/RowList/ui/CellsRow/CellsRow'
import { SELECTION_COLUMN_WIDTH } from 'src/widgets/RowList/ui/RowList/RowListContext'
import styles from 'src/widgets/RowList/ui/RowList/RowList.module.scss'

interface RowListItemProps {
  row: RowItemViewModel
  columnsModel: ColumnsModel
  revisionId: string
  tableId: string
  onCopy?: (rowData: JsonValue) => void
  selection?: SelectionViewModel
  showSelectionColumn?: boolean
}

export const RowListItem: React.FC<RowListItemProps> = observer(
  ({ row, columnsModel, revisionId, tableId, onCopy, selection, showSelectionColumn }) => {
    const { open: menuOpen, setOpen } = useDisclosure()

    const handleCopyRow = useCallback(() => {
      onCopy?.(row.data)
    }, [onCopy, row.data])

    const handleDeleteRow = useCallback(() => {
      selection?.requestSingleDelete(row.id)
    }, [selection, row.id])

    const handleSelectRow = useCallback(() => {
      selection?.enterSelectionMode(row.id)
    }, [selection, row.id])

    const handleToggleSelection = useCallback(() => {
      selection?.toggle(row.id)
    }, [selection, row.id])

    const { upload: handleFileUpload } = useFileUpload({
      revisionId,
      tableId,
      rowId: row.id,
    })

    const isSelected = selection?.isSelected(row.id) ?? false

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
        className={`${styles.Row} group`}
        data-testid={`row-${row.id}`}
        position={row.isRowEditing ? 'relative' : undefined}
        zIndex={row.isRowEditing ? 100 : undefined}
      >
        <Box
          as="td"
          position="sticky"
          left={0}
          zIndex={1}
          backgroundColor="white"
          width={showSelectionColumn ? SELECTION_COLUMN_WIDTH : '0px'}
          minWidth={showSelectionColumn ? SELECTION_COLUMN_WIDTH : '0px'}
          maxWidth={showSelectionColumn ? SELECTION_COLUMN_WIDTH : '0px'}
          pl={showSelectionColumn ? '8px' : '0px'}
          overflow="hidden"
          transition="width 0.15s, min-width 0.15s, max-width 0.15s, padding 0.15s"
        >
          <Flex alignItems="center" height="100%">
            <Checkbox.Root checked={isSelected} onCheckedChange={handleToggleSelection}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
          </Flex>
        </Box>
        <Box
          as="td"
          position="sticky"
          left={showSelectionColumn ? SELECTION_COLUMN_WIDTH : 0}
          zIndex={1}
          backgroundColor="white"
          maxWidth="0"
          pl="8px"
          pr="24px"
          transition="left 0.15s"
        >
          <Flex alignItems="center">
            <Text textDecoration="underline" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
              <Link to={`${row.id}`} data-testid={`row-${row.id}-link`}>
                {row.id}
              </Link>
            </Text>
            {row.showModifiedIndicator && <Text color="gray.400">*</Text>}
          </Flex>
          <Box position="absolute" right={0} top={0} bottom={0} width="1px" bg="gray.100" />
        </Box>

        <CellsRow row={row} columnsModel={columnsModel} revisionId={revisionId} onFileUpload={handleFileUpload} />

        <Box as="td" width="100%"></Box>
        {row.showMenu && (
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
                      {row.canDeleteRow && (
                        <Menu.Item
                          color="gray.600"
                          value="select"
                          data-testid={`select-row-${row.id}`}
                          onClick={handleSelectRow}
                        >
                          <PiCheckSquare />
                          <Box flex="1">Select</Box>
                        </Menu.Item>
                      )}
                      {row.canCreateRow && (
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
                      {row.canDeleteRow && (
                        <Menu.Item
                          color="gray.600"
                          value="delete"
                          data-testid={`remove-row-${row.id}`}
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
  },
)
