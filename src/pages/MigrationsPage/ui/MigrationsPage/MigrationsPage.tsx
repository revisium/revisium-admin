import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { MigrationsPageViewModel } from 'src/pages/MigrationsPage/model/MigrationsPageViewModel.ts'
import { ApplyFromBranchDialog } from 'src/pages/MigrationsPage/ui/ApplyFromBranchDialog/ApplyFromBranchDialog.tsx'
import { ApplyMigrationsDialog } from 'src/pages/MigrationsPage/ui/ApplyMigrationsDialog/ApplyMigrationsDialog.tsx'
import { MigrationsHeader } from 'src/pages/MigrationsPage/ui/MigrationsHeader/MigrationsHeader.tsx'
import { MigrationsList } from 'src/pages/MigrationsPage/ui/MigrationsList/MigrationsList.tsx'
import { useViewModel } from 'src/shared/lib'
import { JsonCard } from 'src/shared/ui'

export const MigrationsPage = observer(() => {
  const model = useViewModel(MigrationsPageViewModel)

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
      <Box mb="4rem">
        <MigrationsHeader
          totalCount={0}
          branchName={model.branchName}
          viewMode={model.viewMode}
          canApplyMigrations={model.canApplyMigrations}
          onViewModeChange={model.setViewMode}
          onApplyFromJson={model.openApplyDialog}
          onApplyFromBranch={model.openApplyFromBranchDialog}
        />
        <Flex justify="center" align="center" height="200px">
          <Text color="newGray.400">No migrations found</Text>
        </Flex>

        {model.applyDialog && <ApplyMigrationsDialog model={model.applyDialog} />}
        {model.applyFromBranchDialog && <ApplyFromBranchDialog model={model.applyFromBranchDialog} />}
      </Box>
    )
  }

  if (model.showList) {
    return (
      <Box mb="4rem">
        <MigrationsHeader
          totalCount={model.totalCount}
          branchName={model.branchName}
          viewMode={model.viewMode}
          canApplyMigrations={model.canApplyMigrations}
          onViewModeChange={model.setViewMode}
          onApplyFromJson={model.openApplyDialog}
          onApplyFromBranch={model.openApplyFromBranchDialog}
        />

        {model.isTableMode ? (
          <MigrationsList items={model.items} />
        ) : (
          <JsonCard readonly data={model.data as unknown as JsonValue} />
        )}

        {model.applyDialog && <ApplyMigrationsDialog model={model.applyDialog} />}
        {model.applyFromBranchDialog && <ApplyFromBranchDialog model={model.applyFromBranchDialog} />}
      </Box>
    )
  }

  return null
})
