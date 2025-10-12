import { Heading, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { SidebarLink } from 'src/shared/ui'
import { useMenuListModel } from 'src/widgets/BranchMenuList/hooks/useMenuListModel.ts'

export const BranchMenuList: FC = observer(() => {
  const store = useMenuListModel()

  return (
    <VStack alignItems="flex-start" gap="1rem">
      <Link to="/">
        <Heading color="gray" size="xl" data-testid="sidebar-back-to-projects-button">
          {store.projectName}
        </Heading>
      </Link>
      <VStack
        alignItems="flex-start"
        borderTop="1px solid"
        borderTopColor="gray.100"
        gap="0.25rem"
        pb="1rem"
        pt="1rem"
        width="100%"
      >
        {store.items.map((branchLink) => (
          <SidebarLink
            touched={branchLink.touched}
            key={branchLink.id}
            dataTestId={`sidebar-branch-${branchLink.name}`}
            label={branchLink.title}
            link={branchLink.link}
            isActive={branchLink.isActive}
          />
        ))}
      </VStack>
    </VStack>
  )
})
