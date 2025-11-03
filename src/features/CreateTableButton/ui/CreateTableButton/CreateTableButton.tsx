import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { CreateButton } from 'src/shared/ui'

interface CreateTableButtonProps {
  onClick: () => void
}

export const CreateTableButton: FC<CreateTableButtonProps> = observer(({ onClick }) => {
  return <CreateButton dataTestId="create-table-button" title="Table" onClick={onClick} />
})
