import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { TableChangeItemModel } from '../../model/TableChangeItemModel'

interface TableChangeListItemProps {
  model: TableChangeItemModel
  onClick?: (model: TableChangeItemModel) => void
}

export const TableChangeListItem: React.FC<TableChangeListItemProps> = observer(({ model, onClick }) => {
  const handleClick = useCallback(() => {
    onClick?.(model)
  }, [onClick, model])

  return (
    <Box height="auto" minHeight="2.5rem" width="100%" paddingY="0.5rem">
      <Flex
        _hover={{ backgroundColor: 'gray.50' }}
        alignItems="flex-start"
        gap="4px"
        paddingLeft="1rem"
        paddingRight="1rem"
        paddingY="0.5rem"
        borderRadius="4px"
        cursor={onClick ? 'pointer' : 'default'}
        onClick={handleClick}
      >
        <Flex direction="column" flex={1} gap="0.25rem">
          <Flex alignItems="center" gap="0.5rem">
            <Text fontWeight="500" color="newGray.500">
              {model.displayName}
            </Text>
            <Text fontSize="12px" fontWeight="500" color={model.changeTypeBadgeColor}>
              {model.changeTypeLabel}
            </Text>
          </Flex>

          {model.isRenamed && model.oldTableId && (
            <Text fontSize="12px" color="gray.400">
              Old name: {model.oldTableId}
            </Text>
          )}

          <Flex gap="1rem" fontSize="12px" color="gray.400">
            {model.hasSchemaChanges && <Text>Schema: {model.schemaMigrationsCount} migration(s)</Text>}
            {model.hasRowChanges && <Text>Rows: {model.rowChangesSummary}</Text>}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
})
