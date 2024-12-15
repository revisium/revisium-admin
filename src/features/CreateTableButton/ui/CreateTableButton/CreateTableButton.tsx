import { observer } from 'mobx-react-lite'
import React from 'react'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { CreateButton } from 'src/shared/ui'

interface CreateTableButtonProps {
  onClick: () => void
}

export const CreateTableButton: React.FC<CreateTableButtonProps> = observer(({ onClick }) => {
  const projectPageModel = useProjectPageModel()

  return (
    <CreateButton
      dataTestId="create-table-button"
      isDisabled={!projectPageModel.isEditableRevision}
      title="Table"
      onClick={onClick}
    />
  )
})
