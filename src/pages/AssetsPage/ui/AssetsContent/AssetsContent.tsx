import { Box, Button, Center, Skeleton, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiFolderOpenLight, PiMagnifyingGlassLight } from 'react-icons/pi'
import { AssetItemViewModel } from 'src/pages/AssetsPage/model/AssetItemViewModel'
import { AssetsGrid } from 'src/pages/AssetsPage/ui/AssetsGrid/AssetsGrid'

interface AssetsContentProps {
  showSkeleton: boolean
  showNoMatchesMessage: boolean
  filteredCount: number
  items: AssetItemViewModel[]
  onSelectFile: (item: AssetItemViewModel) => void
  onClearFilters: () => void
}

const LoadingSkeleton: FC<{ onSelectFile: (item: AssetItemViewModel) => void }> = ({ onSelectFile }) => (
  <>
    <Skeleton height="1em" width="60px" />
    <AssetsGrid items={[]} onSelectFile={onSelectFile} isLoading />
  </>
)

const NoMatchesMessage: FC<{ onClearFilters: () => void }> = ({ onClearFilters }) => (
  <Center width="100%" paddingY={16}>
    <VStack gap={4}>
      <Box color="fg.muted">
        <PiMagnifyingGlassLight size={48} />
      </Box>
      <Text color="newGray.400">No files match your filters</Text>
      <Button variant="outline" size="sm" onClick={onClearFilters}>
        Clear filters
      </Button>
    </VStack>
  </Center>
)

const FilesList: FC<{
  filteredCount: number
  items: AssetItemViewModel[]
  onSelectFile: (item: AssetItemViewModel) => void
}> = ({ filteredCount, items, onSelectFile }) => (
  <>
    <Text color="newGray.400" fontSize="sm">
      {filteredCount} file{filteredCount !== 1 ? 's' : ''}
    </Text>
    <AssetsGrid items={items} onSelectFile={onSelectFile} />
  </>
)

const EmptyState: FC = () => (
  <Center width="100%" paddingY={16}>
    <VStack gap={4}>
      <Box color="fg.muted">
        <PiFolderOpenLight size={48} />
      </Box>
      <Text color="newGray.400">No files found</Text>
    </VStack>
  </Center>
)

export const AssetsContent: FC<AssetsContentProps> = observer(
  ({ showSkeleton, showNoMatchesMessage, filteredCount, items, onSelectFile, onClearFilters }) => {
    if (showSkeleton) {
      return <LoadingSkeleton onSelectFile={onSelectFile} />
    }

    if (showNoMatchesMessage) {
      return <NoMatchesMessage onClearFilters={onClearFilters} />
    }

    if (filteredCount > 0) {
      return <FilesList filteredCount={filteredCount} items={items} onSelectFile={onSelectFile} />
    }

    return <EmptyState />
  },
)
