import { Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { OrgMemberItemViewModel } from 'src/pages/OrganizationMembersPage/model/OrgMemberItemViewModel.ts'
import { MemberCard } from 'src/shared/ui'

interface OrgMemberCardProps {
  model: OrgMemberItemViewModel
}

export const OrgMemberCard: FC<OrgMemberCardProps> = observer(({ model }) => {
  return (
    <MemberCard
      model={model}
      roleSlot={
        <Text fontSize="sm" color="newGray.500" minWidth="80px">
          {model.roleName}
        </Text>
      }
    />
  )
})
