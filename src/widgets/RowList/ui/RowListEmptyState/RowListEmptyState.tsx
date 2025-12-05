import { Box, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuSearch, LuTable } from 'react-icons/lu'
import { RowListViewModel } from 'src/widgets/RowList/model/RowListViewModel'

interface RowListEmptyStateProps {
  model: RowListViewModel
}

export const RowListEmptyState: FC<RowListEmptyStateProps> = observer(({ model }) => {
  if (model.showNotFound) {
    return (
      <VStack paddingY="48px" gap="12px" color="gray.400">
        <Box as={LuSearch} boxSize="48px" />
        <Text fontSize="md">No rows found</Text>
        <Text fontSize="sm">Try a different search term</Text>
      </VStack>
    )
  }

  if (model.showEmpty) {
    return (
      <VStack paddingY="48px" gap="12px" color="gray.400">
        <Box as={LuTable} boxSize="48px" />
        <Text fontSize="md">No rows yet</Text>
        <Text fontSize="sm">Create your first row to get started</Text>
      </VStack>
    )
  }

  return null
})
