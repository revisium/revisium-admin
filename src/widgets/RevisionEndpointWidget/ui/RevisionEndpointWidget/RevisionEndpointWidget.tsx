import { Box } from '@chakra-ui/react'
import React from 'react'

import { BranchEndpointsCard } from 'src/features/BranchEndpointsCard'
import { RevisionsCard } from 'src/features/RevisionsCard'

import branchEndpointsCardStyles from 'src/features/BranchEndpointsCard/ui/BranchEndpointsCard/BranchEndpointsCard.module.scss'

export const RevisionEndpointWidget: React.FC = () => {
  return (
    <Box className={branchEndpointsCardStyles.Root}>
      <RevisionsCard endpointSlot={<BranchEndpointsCard />} />
    </Box>
  )
}
