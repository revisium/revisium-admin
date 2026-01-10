import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useViewModel } from 'src/shared/lib'
import { TableRelationsViewModel } from '../../model/TableRelationsViewModel.ts'
import { TableRelationsGraph } from '../TableRelationsGraph/TableRelationsGraph.tsx'
import { TableRelationsHeader } from '../TableRelationsHeader/TableRelationsHeader.tsx'

export const TableRelations = observer(() => {
  const model = useViewModel(TableRelationsViewModel)

  if (model.showLoading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner />
      </Flex>
    )
  }

  if (model.showError) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Text color="red.500">Error loading table relations</Text>
      </Flex>
    )
  }

  if (model.showEmpty) {
    return (
      <Box mb="4rem">
        <TableRelationsHeader branchName={model.branchName} tablesCount={0} relationsCount={0} />
        <Flex justify="center" align="center" height="200px">
          <Text color="newGray.400">No tables found in this revision</Text>
        </Flex>
      </Box>
    )
  }

  if (model.showGraph) {
    return (
      <Box mb="4rem">
        <TableRelationsHeader
          branchName={model.branchName}
          tablesCount={model.totalTablesCount}
          relationsCount={model.totalRelationsCount}
        />
        <TableRelationsGraph model={model} />
      </Box>
    )
  }

  return null
})
