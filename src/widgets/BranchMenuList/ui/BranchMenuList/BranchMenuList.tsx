import { Box, Flex, Heading, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { useMenuListModel } from 'src/widgets/BranchMenuList/hooks/useMenuListModel.ts'
import { useNavigationState } from 'src/widgets/BranchMenuList/hooks/useNavigationState.ts'
import { NavigationButton } from 'src/widgets/BranchMenuList/ui/NavigationButton/NavigationButton.tsx'
import { SidebarBranchWidget } from 'src/widgets/SidebarBranchWidget'

export const BranchMenuList: FC = observer(() => {
  const store = useMenuListModel()
  const linkMaker = useLinkMaker()
  const { isTablesActive } = useNavigationState()

  return (
    <VStack alignItems="flex-start" gap="1rem">
      <Link to="/">
        <Heading color="gray" size="xl" data-testid="sidebar-back-to-projects-button">
          {store.projectName}
        </Heading>
      </Link>
      <Box pb="8px" pt="8px" width="100%" borderY="1px solid" borderTopColor="gray.100" borderBottomColor="gray.100">
        <SidebarBranchWidget />
      </Box>
      <Flex flexDirection="column" alignItems="flex-start" gap="0.25rem" width="100%">
        <NavigationButton to={linkMaker.currentBaseLink} label="Tables" isActive={isTablesActive} />
      </Flex>
    </VStack>
  )
})
