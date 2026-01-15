import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { PiFolderOpenLight } from 'react-icons/pi'
import { AssetsPageViewModel } from 'src/pages/AssetsPage/model/AssetsPageViewModel'
import { AssetDetailDrawer } from 'src/pages/AssetsPage/ui/AssetDetailDrawer/AssetDetailDrawer'
import { AssetsContent } from 'src/pages/AssetsPage/ui/AssetsContent/AssetsContent'
import { AssetsHeader } from 'src/pages/AssetsPage/ui/AssetsHeader/AssetsHeader'
import { AssetsPageSkeleton } from 'src/pages/AssetsPage/ui/AssetsPageSkeleton/AssetsPageSkeleton'
import { FileOrganizationInfo } from 'src/pages/AssetsPage/ui/FileOrganizationInfo/FileOrganizationInfo'
import { TablesOverview } from 'src/pages/AssetsPage/ui/TablesOverview/TablesOverview'
import { useViewModel } from 'src/shared/lib'

const SKELETON_DELAY = 150

export const AssetsPage: FC = observer(() => {
  const model = useViewModel(AssetsPageViewModel)
  const [showFilesSkeleton, setShowFilesSkeleton] = useState(false)
  const [showPageSkeleton, setShowPageSkeleton] = useState(false)

  useEffect(() => {
    if (model.isLoadingFiles) {
      const timer = setTimeout(() => setShowFilesSkeleton(true), SKELETON_DELAY)
      return () => clearTimeout(timer)
    } else {
      setShowFilesSkeleton(false)
    }
  }, [model.isLoadingFiles])

  useEffect(() => {
    if (model.showLoading) {
      const timer = setTimeout(() => setShowPageSkeleton(true), SKELETON_DELAY)
      return () => clearTimeout(timer)
    } else {
      setShowPageSkeleton(false)
    }
  }, [model.showLoading])

  if (model.showLoading) {
    return showPageSkeleton ? <AssetsPageSkeleton /> : null
  }

  if (model.showError) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Text color="red.500">Error loading assets</Text>
      </Flex>
    )
  }

  if (model.showEmpty && !model.hasTablesWithFiles) {
    return (
      <Flex justify="center" align="center" height="calc(100vh - 200px)">
        <VStack gap={4}>
          <Box color="newGray.300">
            <PiFolderOpenLight size={64} />
          </Box>
          <Text color="newGray.400">No tables with file fields in this revision</Text>
          <HStack gap={1}>
            <Text color="newGray.400" fontSize="sm" textAlign="center" maxWidth="400px">
              Add a File field to any table to start managing assets.
            </Text>
            <FileOrganizationInfo />
          </HStack>
        </VStack>
      </Flex>
    )
  }

  return (
    <Box mb="4rem">
      <Box position="sticky" top={0} bg="white" zIndex={10} pb={3}>
        <AssetsHeader
          branchName={model.branchName}
          tablesCount={model.tablesCount}
          filesCount={model.totalFilesCount}
          filterModel={model.filterModel}
        />

        <TablesOverview
          tables={model.tables}
          selectedTableId={model.selectedTableId}
          onSelectTable={model.selectTable}
        />
      </Box>

      <VStack alignItems="flex-start" gap={3} width="100%" pt={2}>
        <AssetsContent
          showSkeleton={showFilesSkeleton}
          showNoMatchesMessage={model.showNoMatchesMessage}
          filteredCount={model.filteredCount}
          items={model.items}
          onSelectFile={model.selectFile}
          onClearFilters={model.clearFilters}
        />
      </VStack>

      <AssetDetailDrawer item={model.selectedFile} onClose={model.closeFileDetails} />
    </Box>
  )
})
