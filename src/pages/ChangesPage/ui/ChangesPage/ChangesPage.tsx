import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { useViewModel } from 'src/shared/lib/hooks/useViewModel'
import {
  TableChangesList,
  TableChangesListModel,
  TableChangesFilters,
  TableDetailModal,
  TableChangeItemModel,
} from 'src/widgets/TableChangesList'

export const ChangesPage: FC = observer(() => {
  const model = useViewModel(TableChangesListModel)

  const handleTableClick = useCallback(
    (itemModel: TableChangeItemModel) => {
      model.openDetail(itemModel)
    },
    [model],
  )

  return (
    <Box>
      <TableChangesFilters model={model} />

      {model.isLoading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner />
        </Flex>
      ) : model.totalCount === 0 ? (
        <Flex justify="center" align="center" height="200px">
          <Text color="newGray.400">
            {model.hasActiveFilters ? 'No table changes match the selected filters' : 'No table changes found'}
          </Text>
        </Flex>
      ) : (
        <TableChangesList model={model} onTableClick={handleTableClick} />
      )}

      <TableDetailModal model={model.detailModalModel} />
    </Box>
  )
})
