import { Box, Flex, HStack, SimpleGrid, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiStarLight } from 'react-icons/pi'
import { BranchEndpointsViewModel } from 'src/pages/EndpointsPage/model/BranchEndpointsViewModel.ts'
import { EndpointCard } from '../EndpointCard/EndpointCard.tsx'

interface BranchSectionProps {
  model: BranchEndpointsViewModel
}

export const BranchSection: FC<BranchSectionProps> = observer(({ model }) => {
  return (
    <Box>
      <Flex align="center" gap={2} mb={2}>
        <Text fontSize="14px" fontWeight="500" color="newGray.600">
          {model.branchName}
        </Text>
        {model.isRootBranch && (
          <HStack gap={1} color="newGray.400">
            <PiStarLight size={14} />
            <Text fontSize="12px">default</Text>
          </HStack>
        )}
      </Flex>

      <SimpleGrid columns={2} gap={3}>
        <EndpointCard model={model.draftCard} />
        <EndpointCard model={model.headCard} />
      </SimpleGrid>
    </Box>
  )
})
