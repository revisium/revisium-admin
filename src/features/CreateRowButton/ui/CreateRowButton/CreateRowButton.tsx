import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { CreateButton } from 'src/shared/ui'

interface CreateRowButtonProps {
  onClick: () => void
}

export const CreateRowButton: FC<CreateRowButtonProps> = observer(({ onClick }) => {
  return <CreateButton dataTestId="create-row-button" title="Row" onClick={onClick} />
})
