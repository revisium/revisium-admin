import { Box, HStack, Skeleton, VStack } from '@chakra-ui/react'
import { FC } from 'react'

export const AssetsPageSkeleton: FC = () => {
  return (
    <Box mb="4rem">
      <Box pt={4} pb={2}>
        <Skeleton height="28px" width="320px" mb={1} />
        <Skeleton height="16px" width="420px" />
      </Box>

      <VStack alignItems="flex-start" gap={2} width="100%" pt={2}>
        <HStack gap={2}>
          <Skeleton height="32px" width="60px" borderRadius="md" />
          <Skeleton height="32px" width="100px" borderRadius="md" />
          <Skeleton height="32px" width="80px" borderRadius="md" />
          <Skeleton height="32px" width="90px" borderRadius="md" />
        </HStack>

        <HStack gap={3} width="100%" pt={1}>
          <Skeleton height="32px" width="200px" borderRadius="md" />
          <Skeleton height="32px" width="130px" borderRadius="md" />
          <Skeleton height="32px" width="150px" borderRadius="md" />
          <Skeleton height="32px" width="140px" borderRadius="md" />
        </HStack>
      </VStack>
    </Box>
  )
}
