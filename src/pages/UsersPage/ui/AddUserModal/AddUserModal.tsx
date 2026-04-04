import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { AddUserModalViewModel } from 'src/pages/UsersPage/model/AddUserModalViewModel.ts'
import { AddMemberModal } from 'src/shared/ui'
import { RoleSelect } from '../RoleSelect'

interface AddUserModalProps {
  model: AddUserModalViewModel
}

export const AddUserModal: FC<AddUserModalProps> = observer(({ model }) => {
  return (
    <AddMemberModal
      model={model}
      title="Add User to Project"
      roleSelect={<RoleSelect value={model.selectedRole} onChange={model.setSelectedRole} />}
    />
  )
})
