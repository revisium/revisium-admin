import { Heading, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useMenuListModel } from 'src/widgets/BranchMenuList/hooks/useMenuListModel.ts'
import { SidebarBranchWidget } from 'src/widgets/SidebarBranchWidget'

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
        <SidebarBranchWidget />
      </VStack>
    </VStack>
  )
})
