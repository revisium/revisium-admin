import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { RowChangeItemModel } from '../../model/RowChangeItemModel'

interface RowChangeListItemProps {
  model: RowChangeItemModel
  onClick?: (model: RowChangeItemModel) => void
}

export const RowChangeListItem: React.FC<RowChangeListItemProps> = observer(({ model, onClick }) => {
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
            <Text fontWeight="500" color="newGray.500" fontSize="14px">
              {model.fullDisplayPath}
            </Text>
            <Text fontSize="12px" fontWeight="500" color={model.changeTypeBadgeColor}>
              {model.changeTypeLabel}
            </Text>
          </Flex>

          {model.isRenamed && model.oldRowId && (
            <Text fontSize="12px" color="gray.400">
              Old ID: {model.oldRowId}
            </Text>
          )}

          {model.hasFieldChanges && (
            <Text fontSize="12px" color="gray.400">
              {model.fieldChangesCount} field(s) changed
            </Text>
          )}
        </Flex>
      </Flex>
    </Box>
  )
})
