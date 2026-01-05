import { NativeSelect } from '@chakra-ui/react/native-select'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { UserSystemRole } from 'src/__generated__/graphql-request'

interface SystemRoleSelectProps {
  value: UserSystemRole
  onChange: (role: UserSystemRole) => void
  disabled?: boolean
}

const ROLE_LABELS: Record<UserSystemRole, string> = {
  [UserSystemRole.SystemAdmin]: 'System Admin',
  [UserSystemRole.SystemFullApiRead]: 'Full API Read',
  [UserSystemRole.SystemUser]: 'User',
}

export const SystemRoleSelect: FC<SystemRoleSelectProps> = observer(({ value, onChange, disabled }) => {
  return (
    <NativeSelect.Root size="sm" width="160px" {...(disabled && { opacity: 0.5, pointerEvents: 'none' })}>
      <NativeSelect.Field value={value} onChange={(e) => onChange(e.target.value as UserSystemRole)}>
        {Object.values(UserSystemRole).map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </NativeSelect.Field>
    </NativeSelect.Root>
  )
})
