import { Box, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { BranchEndpointsViewModel } from '../../model/BranchEndpointsViewModel.ts'
import { CustomEndpointCardViewModel } from '../../model/CustomEndpointCardViewModel.ts'
import { BranchSection } from '../BranchSection/BranchSection.tsx'
import { CustomEndpointCard } from '../CustomEndpointCard/CustomEndpointCard.tsx'

interface EndpointTabContentProps {
  branchSections: BranchEndpointsViewModel[]
  customEndpoints: CustomEndpointCardViewModel[]
  hasCustomEndpoints: boolean
  canDeleteEndpoint: boolean
  onDeleteEndpoint: (endpointId: string) => void
}

export const EndpointTabContent: FC<EndpointTabContentProps> = observer(
  ({ branchSections, customEndpoints, hasCustomEndpoints, canDeleteEndpoint, onDeleteEndpoint }) => {
    return (
      <VStack align="stretch" gap={6}>
        {branchSections.map((section) => (
          <BranchSection key={section.branchId} model={section} />
        ))}
        {hasCustomEndpoints && (
          <Box>
            <Text fontSize="sm" fontWeight="500" color="newGray.500" mb={2}>
              Custom Revisions
            </Text>
            <VStack align="stretch" gap={2}>
              {customEndpoints.map((cardModel) => (
                <CustomEndpointCard
                  key={cardModel.id}
                  model={cardModel}
                  onDelete={onDeleteEndpoint}
                  canDelete={canDeleteEndpoint}
                />
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    )
  },
)
