import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { AddOrgMemberModalViewModel } from 'src/pages/OrganizationMembersPage/model/AddOrgMemberModalViewModel.ts'
import { AddMemberModal } from 'src/shared/ui'
import { OrgRoleSelect } from '../OrgRoleSelect/OrgRoleSelect.tsx'

interface AddOrgMemberModalProps {
  model: AddOrgMemberModalViewModel
}

export const AddOrgMemberModal: FC<AddOrgMemberModalProps> = observer(({ model }) => {
  return (
    <AddMemberModal
      model={model}
      title="Add Member to Organization"
      roleSelect={<OrgRoleSelect value={model.selectedRole} onChange={model.setSelectedRole} />}
    />
  )
})
