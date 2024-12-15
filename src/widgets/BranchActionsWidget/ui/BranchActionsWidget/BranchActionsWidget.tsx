import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'

import { CreateRevisionButton } from 'src/features/CreateRevisionButton'
import { RevertBranchChangesButton } from 'src/features/RevertBranchChangesButton'
import { useBranchActionsWidgetModel } from 'src/widgets/BranchActionsWidget/hooks/useBranchActionsWidgetModel.ts'
import { CreateBranchWidget } from 'src/widgets/BranchActionsWidget/ui/CreateBranchWidget/CreateBranchWidget.tsx'

export const BranchActionsWidget: React.FC = observer(() => {
  const store = useBranchActionsWidgetModel()

  return (
    <Flex gap="0.5rem" alignItems="center">
      {store.showActions && (
        <>
          <CreateRevisionButton onClick={store.createRevision} />
          <RevertBranchChangesButton onClick={store.revertChanges} />
        </>
      )}
      {store.showCreateBranchCard && <CreateBranchWidget onCreate={store.createBranchByRevisionId} />}
    </Flex>
  )
})
