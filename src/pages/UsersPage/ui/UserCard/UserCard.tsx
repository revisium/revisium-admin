import { Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { UserItemViewModel } from 'src/pages/UsersPage/model/UserItemViewModel.ts'
import { MemberCard } from 'src/shared/ui'
import { RoleSelect } from '../RoleSelect'

interface UserCardProps {
  model: UserItemViewModel
}

export const UserCard: FC<UserCardProps> = observer(({ model }) => {
  return (
    <MemberCard
      model={model}
      roleSlot={
        <>
          {model.isUpdating && <Spinner size="sm" />}

          {model.canUpdateRole ? (
            <RoleSelect value={model.roleId} onChange={(role) => model.updateRole(role)} disabled={model.isUpdating} />
          ) : (
            <Text fontSize="sm" color="newGray.500" minWidth="80px">
              {model.roleName}
            </Text>
          )}
        </>
      }
    />
  )
})
