import { Box, Link, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuFilter, LuSearch, LuTable } from 'react-icons/lu'
import { RowListViewModel } from 'src/widgets/RowList/model/RowListViewModel'

interface RowListEmptyStateProps {
  model: RowListViewModel
  onCreate?: () => void
}

export const RowListEmptyState: FC<RowListEmptyStateProps> = observer(({ model, onCreate }) => {
  if (model.showNotFound) {
    const Icon = model.emptyStateType === 'filters' ? LuFilter : LuSearch

    return (
      <VStack flex={1} justifyContent="center" gap="12px" color="gray.400">
        <Box as={Icon} boxSize="48px" />
        <Text fontSize="md">No rows found</Text>
        <Text fontSize="sm">{model.emptyStateHint}</Text>
      </VStack>
    )
  }

  if (model.showEmpty) {
    return (
      <VStack flex={1} justifyContent="center" gap="12px" color="gray.400">
        <Box as={LuTable} boxSize="48px" />
        <Text fontSize="md">No rows yet</Text>
        {onCreate ? (
          <Link fontSize="sm" color="gray.500" _hover={{ color: 'gray.600' }} onClick={onCreate} cursor="pointer">
            Create your first row to get started
          </Link>
        ) : (
          <Text fontSize="sm">Create your first row to get started</Text>
        )}
      </VStack>
    )
  }

  return null
})
