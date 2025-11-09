import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { MigrationsViewModel } from 'src/pages/MigrationsPage/model/MigrationsViewModel.ts'
import { MigrationsTableView } from 'src/pages/MigrationsPage/ui/MigrationsTableView/MigrationsTableView'
import { MigrationsViewSwitcher } from 'src/pages/MigrationsPage/ui/MigrationsViewSwitcher/MigrationsViewSwitcher'
import { useViewModel } from 'src/shared/lib'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { JsonCard } from 'src/shared/ui'

export const MigrationsPage = observer(() => {
  const projectPageModel = useProjectPageModel()
  const model = useViewModel(MigrationsViewModel, projectPageModel)

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
        <Text color="red.500">Error loading migrations</Text>
      </Flex>
    )
  }

  if (model.showEmpty) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Text color="gray.400">No migrations found</Text>
      </Flex>
    )
  }

  if (model.showList) {
    return (
      <Box mb="4rem">
        <Flex justify="space-between" align="center" marginBottom="16px">
          <Text fontSize="20px" fontWeight="600" color="gray.500">
            {model.isTableMode ? `Operations (${model.totalCount})` : `Migrations (${model.data.length})`}
          </Text>
          <MigrationsViewSwitcher mode={model.viewMode} onChange={(mode) => model.setViewMode(mode)} />
        </Flex>

        {model.isTableMode ? (
          <MigrationsTableView model={model} />
        ) : (
          <JsonCard readonly data={model.data as unknown as JsonValue} />
        )}
      </Box>
    )
  }

  return null
})
