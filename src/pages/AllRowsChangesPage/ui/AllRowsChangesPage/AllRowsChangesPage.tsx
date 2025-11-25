import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel'
import { RowChangesList, RowChangesListModel, RowChangesFilters, RowChangeItemModel } from 'src/widgets/RowChangesList'
import { RowDetailModal } from 'src/widgets/RowDetailModal'

export const AllRowsChangesPage: FC = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tableParam = searchParams.get('table')

  const projectPageModel = useProjectPageModel()
  const linkMaker = useLinkMaker()

  const [model] = useState(
    () => new RowChangesListModel(projectPageModel.revisionOrThrow.id, linkMaker, tableParam ?? undefined),
  )

  useEffect(() => {
    const tableId = model.tableId
    if (tableId) {
      setSearchParams({ table: tableId })
    } else if (tableParam) {
      setSearchParams({})
    }
  }, [model.tableId, setSearchParams, tableParam])

  const handleRowClick = useCallback(
    (itemModel: RowChangeItemModel) => {
      model.openDetail(itemModel)
    },
    [model],
  )

  return (
    <Box>
      <RowChangesFilters model={model} />

      {model.isLoading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner />
        </Flex>
      ) : model.totalCount === 0 ? (
        <Flex justify="center" align="center" height="200px">
          <Text color="newGray.400">
            {model.hasActiveFilters ? 'No row changes match the selected filters' : 'No row changes found'}
          </Text>
        </Flex>
      ) : (
        <RowChangesList model={model} onRowClick={handleRowClick} />
      )}

      <RowDetailModal model={model.detailModalModel} />
    </Box>
  )
})
