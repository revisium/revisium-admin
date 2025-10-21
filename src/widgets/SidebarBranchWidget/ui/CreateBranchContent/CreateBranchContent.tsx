import { Popover } from '@chakra-ui/react'
import React from 'react'
import { CreateBranchCard } from 'src/features/CreateBranchCard/ui/CreateBranchCard/CreateBranchCard.tsx'

export const CreateBranchContent: React.FC = () => {
  return (
    <Popover.Content>
      <Popover.CloseTrigger color="gray.400" />
      <Popover.Body>
        <CreateBranchCard onCancel={() => {}} onAdd={async () => {}} />
      </Popover.Body>
    </Popover.Content>
  )
}
