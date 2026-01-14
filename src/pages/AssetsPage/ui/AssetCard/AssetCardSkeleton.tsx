import { Box, Flex, Skeleton, VStack } from '@chakra-ui/react'
import { FC } from 'react'

export const AssetCardSkeleton: FC = () => {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="bg.panel">
      <Skeleton height="120px" />

      <VStack align="stretch" padding={3} gap={1}>
        <Skeleton height="1.25em" width="80%" />

        <Flex justify="space-between" align="center" gap={2}>
          <Skeleton height="1em" width="60px" />
          <Skeleton height="1em" width="40px" />
        </Flex>
      </VStack>
    </Box>
  )
}
