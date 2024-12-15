import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'

import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { BranchMenuList } from 'src/widgets/BranchMenuList'
import { TableMenuList } from 'src/widgets/TableMenuList'

export const SidebarWidget: React.FC = observer(() => {
  const projectPageModel = useProjectPageModel()

  return (
    <>
      <Box minHeight="120px">
        <BranchMenuList />
      </Box>
      {projectPageModel.table && (
        <Box borderTop="1px solid" borderTopColor="gray.100" paddingTop="1rem">
          <TableMenuList />
        </Box>
      )}
    </>
  )
})
