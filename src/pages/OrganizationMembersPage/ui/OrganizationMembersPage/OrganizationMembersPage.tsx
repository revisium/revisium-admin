import { observer } from 'mobx-react-lite'
import { OrganizationMembersPageViewModel } from 'src/pages/OrganizationMembersPage/model/OrganizationMembersPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { MembersPageLayout } from 'src/shared/ui'
import { OrganizationSidebar } from 'src/widgets/OrganizationSidebar'
import { AddOrgMemberModal } from '../AddOrgMemberModal/AddOrgMemberModal.tsx'
import { OrgMemberCard } from '../OrgMemberCard/OrgMemberCard.tsx'

export const OrganizationMembersPage = observer(() => {
  const model = useViewModel(OrganizationMembersPageViewModel)

  return (
    <MembersPageLayout
      model={model}
      sidebar={<OrganizationSidebar />}
      label="Members"
      emptyTitle="No members in this organization"
      emptySubtitle="Add team members to collaborate in this organization"
      subtitle="Manage team members and their access levels for this organization."
      onAddClick={() => model.addMemberModal.open()}
      modal={<AddOrgMemberModal model={model.addMemberModal} />}
    >
      {model.items.map((itemModel) => (
        <OrgMemberCard key={itemModel.id} model={itemModel} />
      ))}
    </MembersPageLayout>
  )
})
