import { observer } from 'mobx-react-lite'
import React from 'react'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { CreateButton } from 'src/shared/ui'

interface CreateRowButtonProps {
  onClick: () => void
}

export const CreateRowButton: React.FC<CreateRowButtonProps> = observer(({ onClick }) => {
  const projectPageModel = useProjectPageModel()

  return (
    <CreateButton
      dataTestId="create-row-button"
      disabled={!projectPageModel.isEditableRevision}
      title="Row"
      onClick={onClick}
    />
  )
})
