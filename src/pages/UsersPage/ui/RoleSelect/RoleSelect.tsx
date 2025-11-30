import { NativeSelect } from '@chakra-ui/react/native-select'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { UserProjectRoles } from 'src/__generated__/graphql-request'

interface RoleSelectProps {
  value: UserProjectRoles
  onChange: (role: UserProjectRoles) => void
  disabled?: boolean
}

const ROLE_LABELS: Record<UserProjectRoles, string> = {
  [UserProjectRoles.Developer]: 'Developer',
  [UserProjectRoles.Editor]: 'Editor',
  [UserProjectRoles.Reader]: 'Reader',
}

export const RoleSelect: FC<RoleSelectProps> = observer(({ value, onChange, disabled }) => {
  return (
    <NativeSelect.Root size="sm" width="120px" {...(disabled && { opacity: 0.5, pointerEvents: 'none' })}>
      <NativeSelect.Field value={value} onChange={(e) => onChange(e.target.value as UserProjectRoles)}>
        {Object.values(UserProjectRoles).map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </NativeSelect.Field>
    </NativeSelect.Root>
  )
})
