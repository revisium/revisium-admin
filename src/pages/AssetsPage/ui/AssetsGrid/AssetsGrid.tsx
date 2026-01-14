import { Box, SimpleGrid, useBreakpointValue } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useMemo } from 'react'
import { AssetItemViewModel } from 'src/pages/AssetsPage/model/AssetItemViewModel'
import { AssetCard } from 'src/pages/AssetsPage/ui/AssetCard/AssetCard'
import { AssetCardSkeleton } from 'src/pages/AssetsPage/ui/AssetCard/AssetCardSkeleton'

interface AssetsGridProps {
  items: AssetItemViewModel[]
  onSelectFile: (item: AssetItemViewModel) => void
  isLoading?: boolean
}

const COLUMNS = { base: 2, sm: 3, md: 4, lg: 5 }
const SKELETON_COUNT = 10

export const AssetsGrid: FC<AssetsGridProps> = observer(({ items, onSelectFile, isLoading }) => {
  const columns = useBreakpointValue(COLUMNS) ?? 5

  const placeholdersCount = useMemo(() => {
    if (items.length === 0) {
      return 0
    }
    const remainder = items.length % columns
    return remainder === 0 ? 0 : columns - remainder
  }, [items.length, columns])

  if (isLoading) {
    return (
      <SimpleGrid columns={COLUMNS} gap={4} width="100%">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <AssetCardSkeleton key={`skeleton-${index}`} />
        ))}
      </SimpleGrid>
    )
  }

  return (
    <SimpleGrid columns={COLUMNS} gap={4} width="100%">
      {items.map((item) => (
        <AssetCard key={item.uniqueKey} item={item} onClick={() => onSelectFile(item)} />
      ))}
      {Array.from({ length: placeholdersCount }).map((_, index) => (
        <Box key={`placeholder-${index}`} visibility="hidden" />
      ))}
    </SimpleGrid>
  )
})
