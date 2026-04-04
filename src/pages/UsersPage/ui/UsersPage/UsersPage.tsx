import { observer } from 'mobx-react-lite'
import { UsersPageViewModel } from 'src/pages/UsersPage/model/UsersPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { MembersPageLayout } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'
import { AddUserModal } from '../AddUserModal'
import { UserCard } from '../UserCard'

export const UsersPage = observer(() => {
  const model = useViewModel(UsersPageViewModel)

  return (
    <MembersPageLayout
      model={model}
      sidebar={<ProjectSidebar />}
      label="Users"
      emptyTitle="No users in this project"
      emptySubtitle="Add team members to collaborate on this project"
      subtitle="Manage team members and their access levels for this project."
      onAddClick={() => model.addUserModal.open()}
      modal={<AddUserModal model={model.addUserModal} />}
    >
      {model.items.map((itemModel) => (
        <UserCard key={itemModel.id} model={itemModel} />
      ))}
    </MembersPageLayout>
  )
})
