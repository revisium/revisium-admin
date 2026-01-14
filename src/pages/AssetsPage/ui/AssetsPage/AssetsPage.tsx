import { Box, Button, Center, Flex, Skeleton, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { PiFolderOpenLight, PiMagnifyingGlassLight } from 'react-icons/pi'
import { AssetsPageViewModel } from 'src/pages/AssetsPage/model/AssetsPageViewModel'
import { AssetDetailDrawer } from 'src/pages/AssetsPage/ui/AssetDetailDrawer/AssetDetailDrawer'
import { AssetsFilter } from 'src/pages/AssetsPage/ui/AssetsFilter/AssetsFilter'
import { AssetsGrid } from 'src/pages/AssetsPage/ui/AssetsGrid/AssetsGrid'
import { AssetsHeader } from 'src/pages/AssetsPage/ui/AssetsHeader/AssetsHeader'
import { AssetsPageSkeleton } from 'src/pages/AssetsPage/ui/AssetsPageSkeleton/AssetsPageSkeleton'
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
      <Box mb="4rem">
        <AssetsHeader branchName={model.branchName} tablesCount={0} filesCount={0} />
        <Flex justify="center" align="center" height="200px">
          <VStack gap={4}>
            <Box color="fg.muted">
              <PiFolderOpenLight size={64} />
            </Box>
            <Text color="newGray.400">No tables with file fields in this revision</Text>
            <Text color="newGray.400" fontSize="sm" textAlign="center" maxWidth="400px">
              Add a File field to any table to start managing assets
            </Text>
          </VStack>
        </Flex>
      </Box>
    )
  }

  return (
    <Box mb="4rem">
      <Box position="sticky" top={0} bg="white" zIndex={10} pb={3}>
        <AssetsHeader
          branchName={model.branchName}
          tablesCount={model.tablesCount}
          filesCount={model.totalFilesCount}
        />

        <VStack alignItems="flex-start" gap={2} width="100%">
          <TablesOverview
            tables={model.tables}
            selectedTableId={model.selectedTableId}
            onSelectTable={model.selectTable}
          />

          <AssetsFilter model={model.filterModel} />
        </VStack>
      </Box>

      <VStack alignItems="flex-start" gap={3} width="100%" pt={2}>
        {showFilesSkeleton ? (
          <>
            <Skeleton height="1em" width="60px" />
            <AssetsGrid items={[]} onSelectFile={model.selectFile} isLoading />
          </>
        ) : model.showNoMatchesMessage ? (
          <Center width="100%" paddingY={16}>
            <VStack gap={4}>
              <Box color="fg.muted">
                <PiMagnifyingGlassLight size={48} />
              </Box>
              <Text color="newGray.400">No files match your filters</Text>
              <Button variant="outline" size="sm" onClick={model.clearFilters}>
                Clear filters
              </Button>
            </VStack>
          </Center>
        ) : model.filteredCount > 0 ? (
          <>
            <Text color="newGray.400" fontSize="sm">
              {model.filteredCount} file{model.filteredCount !== 1 ? 's' : ''}
            </Text>
            <AssetsGrid items={model.items} onSelectFile={model.selectFile} />
          </>
        ) : (
          <Center width="100%" paddingY={16}>
            <VStack gap={4}>
              <Box color="fg.muted">
                <PiFolderOpenLight size={48} />
              </Box>
              <Text color="newGray.400">No files found</Text>
            </VStack>
          </Center>
        )}
      </VStack>

      <AssetDetailDrawer item={model.selectedFile} onClose={model.closeFileDetails} />
    </Box>
  )
})
