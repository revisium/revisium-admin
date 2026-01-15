import { Box, HStack, SimpleGrid, Skeleton } from '@chakra-ui/react'
import { FC } from 'react'
import { AssetCardSkeleton } from 'src/pages/AssetsPage/ui/AssetCard/AssetCardSkeleton'

const COLUMNS = { base: 2, sm: 3, md: 4, lg: 5 }

export const AssetsPageSkeleton: FC = () => {
  return (
    <Box mb="4rem">
      <Box pt={4} pb={6}>
        <HStack justify="space-between" align="center" mb={1} flexWrap="wrap" gap={2}>
          <Skeleton height="28px" width="180px" />
          <HStack gap={4}>
            <Skeleton height="24px" width="160px" />
            <HStack gap={3}>
              <Skeleton height="18px" width="60px" />
              <Skeleton height="18px" width="70px" />
              <Skeleton height="18px" width="65px" />
            </HStack>
          </HStack>
        </HStack>
        <Skeleton height="14px" width="160px" />
      </Box>

      <Box pb={3}>
        <HStack gap={4} paddingY={1}>
          <Skeleton height="18px" width="30px" />
          <Skeleton height="18px" width="70px" />
          <Skeleton height="18px" width="55px" />
          <Skeleton height="18px" width="65px" />
        </HStack>
      </Box>

      <Skeleton height="14px" width="50px" mt={2} />

      <SimpleGrid columns={COLUMNS} gap={4} width="100%" pt={3}>
        {Array.from({ length: 10 }).map((_, index) => (
          <AssetCardSkeleton key={`skeleton-${index}`} />
        ))}
      </SimpleGrid>
    </Box>
  )
}
