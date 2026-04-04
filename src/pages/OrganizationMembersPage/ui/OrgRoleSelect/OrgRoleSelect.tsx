import { NativeSelect } from '@chakra-ui/react/native-select'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { UserOrganizationRoles } from 'src/__generated__/graphql-request'

interface OrgRoleSelectProps {
  value: UserOrganizationRoles
  onChange: (role: UserOrganizationRoles) => void
  disabled?: boolean
}

const ASSIGNABLE_ROLES = [
  UserOrganizationRoles.OrganizationAdmin,
  UserOrganizationRoles.Developer,
  UserOrganizationRoles.Editor,
  UserOrganizationRoles.Reader,
]

const ROLE_LABELS: Record<UserOrganizationRoles, string> = {
  [UserOrganizationRoles.OrganizationOwner]: 'Owner',
  [UserOrganizationRoles.OrganizationAdmin]: 'Admin',
  [UserOrganizationRoles.Developer]: 'Developer',
  [UserOrganizationRoles.Editor]: 'Editor',
  [UserOrganizationRoles.Reader]: 'Reader',
}

export const OrgRoleSelect: FC<OrgRoleSelectProps> = observer(({ value, onChange, disabled }) => {
  return (
    <NativeSelect.Root size="sm" width="120px" {...(disabled && { opacity: 0.5, pointerEvents: 'none' })}>
      <NativeSelect.Field value={value} onChange={(e) => onChange(e.target.value as UserOrganizationRoles)} disabled={disabled}>
        {ASSIGNABLE_ROLES.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </NativeSelect.Field>
    </NativeSelect.Root>
  )
})
