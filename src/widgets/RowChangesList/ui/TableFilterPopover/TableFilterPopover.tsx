import { Box, Button, Flex, Popover, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { PiCaretDownBold, PiXBold } from 'react-icons/pi'
import { TableFilterModel } from '../../model/TableFilterModel'

interface TableFilterPopoverProps {
  model: TableFilterModel
}

export const TableFilterPopover: FC<TableFilterPopoverProps> = observer(({ model }) => {
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      model.clear()
    },
    [model],
  )

  return (
    <Popover.Root
      lazyMount
      unmountOnExit
      portalled
      open={model.isOpen}
      onOpenChange={({ open }) => model.setIsOpen(open)}
      positioning={{ placement: 'bottom-start' }}
    >
      <Popover.Trigger asChild>
        <Button variant="ghost" size="sm" fontWeight="normal" focusRing="none" maxWidth="200px">
          <Flex alignItems="center" gap="0.25rem">
            <Text
              fontSize="14px"
              color={model.hasSelection ? 'newGray.500' : 'newGray.400'}
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {model.displayName}
            </Text>
            {model.hasSelection ? (
              <PiXBold size={12} color="gray" onClick={handleClear} />
            ) : (
              <PiCaretDownBold size={12} color="gray" />
            )}
          </Flex>
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="250px" maxHeight="300px" overflowY="auto">
            <Popover.Body padding="0.5rem">
              <Box
                paddingX="0.5rem"
                paddingY="0.375rem"
                borderRadius="4px"
                cursor="pointer"
                _hover={{ backgroundColor: 'gray.50' }}
                onClick={() => model.select(null)}
                backgroundColor={!model.hasSelection ? 'gray.100' : undefined}
              >
                <Text fontSize="14px" color="newGray.500" fontWeight={!model.hasSelection ? '500' : '400'}>
                  All tables
                </Text>
              </Box>
              {model.sortedTables.map((table) => {
                const tableDisplayName = model.getTableDisplayName(table)
                const isSelected = model.isSelected(table)
                return (
                  <Box
                    key={table.tableId}
                    paddingX="0.5rem"
                    paddingY="0.375rem"
                    borderRadius="4px"
                    cursor="pointer"
                    _hover={{ backgroundColor: 'gray.50' }}
                    onClick={() => model.select(tableDisplayName)}
                    backgroundColor={isSelected ? 'gray.100' : undefined}
                  >
                    <Flex alignItems="center" gap="0.5rem">
                      <Text
                        fontSize="14px"
                        color="newGray.500"
                        fontWeight={isSelected ? '500' : '400'}
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        overflow="hidden"
                      >
                        {tableDisplayName}
                      </Text>
                      <Text fontSize="12px" color="newGray.300" flexShrink={0}>
                        ({table.rowChangesCount})
                      </Text>
                    </Flex>
                    {(table.changeType === 'RENAMED' || table.changeType === 'RENAMED_AND_MODIFIED') &&
                      table.oldTableId && (
                        <Text fontSize="11px" color="gray.400">
                          was: {table.oldTableId}
                        </Text>
                      )}
                  </Box>
                )
              })}
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
})
