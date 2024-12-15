import React, { useCallback } from 'react'
import { useToggle } from 'react-use'
import { CreateBranchCard } from 'src/features/CreateBranchCard'
import { CreateButton } from 'src/shared/ui'

interface CreateBranchWidgetProps {
  onCreate: (branchName: string) => Promise<void>
}

export const CreateBranchWidget: React.FC<CreateBranchWidgetProps> = ({ onCreate }) => {
  const [branchOn, toggleBranch] = useToggle(false)

  const handleAddBranch = useCallback(
    async (branchName: string) => {
      await onCreate(branchName)
      toggleBranch()
    },
    [onCreate, toggleBranch],
  )

  return branchOn ? (
    <CreateBranchCard onAdd={handleAddBranch} onCancel={toggleBranch} />
  ) : (
    <CreateButton dataTestId="create-branch-button" title="Branch" onClick={toggleBranch} />
  )
}
