import { Box, Flex, Separator, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import {
  PiGearLight,
  // PiKeyLight,
  PiUsersLight,
  PiDatabaseLight,
  PiFileTextLight,
  // PiFileLight,
  PiShuffleLight,
  PiMagnifyingGlassLight,
  PiPlugLight,
  PiRobotLight,
} from 'react-icons/pi'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { CHANGES_ROUTE, MIGRATIONS_ROUTE } from 'src/shared/config/routes.ts'
import { useNavigationState } from 'src/widgets/ProjectSidebar/hooks/useNavigationState.ts'
import { ProjectSidebarViewModel } from 'src/widgets/ProjectSidebar/model/ProjectSidebarViewModel.ts'
import { CollapsibleGroupButton } from 'src/widgets/ProjectSidebar/ui/CollapsibleGroupButton/CollapsibleGroupButton.tsx'
import { NavigationButton } from 'src/widgets/ProjectSidebar/ui/NavigationButton/NavigationButton.tsx'
import { ProjectHeader } from 'src/widgets/ProjectSidebar/ui/ProjectButton/ProjectButton.tsx'
import { BranchWidget } from 'src/widgets/SidebarBranchWidget'
import { useViewModel } from 'src/shared/lib'
import { SearchModal, SearchModalModel } from 'src/widgets/SearchModal'

export const ProjectSidebar: FC = observer(() => {
  const model = useViewModel(ProjectSidebarViewModel)
  const searchModel = useViewModel(SearchModalModel)

  const linkMaker = useLinkMaker()

  const {
    isTablesActive,
    isChangesActive,
    isMigrationsActive,
    isProjectSettingsActive,
    isEndpointsActive,
    isProjectUsersActive,
    isMcpActive,
    isProjectLevelActive,
  } = useNavigationState()

  useEffect(() => {
    if (isProjectLevelActive) {
      model.expandProjectSection()
    }
  }, [isProjectLevelActive, model])

  return (
    <VStack alignItems="flex-start" gap={0} width="100%">
      <ProjectHeader name={model.projectName} organizationName={model.organizationId} />

      <Box width="100%" paddingY="16px">
        <Separator borderColor="newGray.100" />
      </Box>

      <Flex flexDirection="column" width="100%" gap={1}>
        <NavigationButton
          label="Search"
          icon={<PiMagnifyingGlassLight />}
          isActive={false}
          onClick={() => searchModel.openModal()}
        />

        <CollapsibleGroupButton
          label={<BranchWidget />}
          isExpanded={model.isBranchSectionExpanded}
          onClick={model.handleBranchSectionClick}
          disableLabelClick={true}
        >
          <NavigationButton
            to={linkMaker.currentBaseLink}
            label="Database"
            icon={<PiDatabaseLight />}
            isActive={isTablesActive}
          />
          <NavigationButton
            to={`${linkMaker.currentBaseLink}/${CHANGES_ROUTE}`}
            label="Changes"
            icon={<PiFileTextLight />}
            isActive={isChangesActive}
            badge={model.changesCount}
          />
          {/*<NavigationButton*/}
          {/*  to={`${linkMaker.currentBaseLink}/-/assets`}*/}
          {/*  label="Assets"*/}
          {/*  icon={<PiFileLight />}*/}
          {/*  isActive={isAssetsActive}*/}
          {/*/>*/}
          <NavigationButton
            to={`${linkMaker.currentBaseLink}/${MIGRATIONS_ROUTE}`}
            label="Migrations"
            icon={<PiShuffleLight />}
            isActive={isMigrationsActive}
          />
        </CollapsibleGroupButton>

        <CollapsibleGroupButton
          label="Management"
          isExpanded={model.isProjectSectionExpanded}
          onClick={model.handleProjectSectionClick}
        >
          <NavigationButton
            to={linkMaker.makeEndpointsLink()}
            label="Endpoints"
            icon={<PiPlugLight />}
            isActive={isEndpointsActive}
          />
          <NavigationButton
            to={linkMaker.makeMcpLink()}
            label="MCP Server"
            icon={<PiRobotLight />}
            isActive={isMcpActive}
          />
          {model.canManageUsers && (
            <NavigationButton
              to={linkMaker.makeProjectUsersLink()}
              label="Users"
              icon={<PiUsersLight />}
              isActive={isProjectUsersActive}
            />
          )}
          {model.canAccessSettings && (
            <NavigationButton
              to={linkMaker.makeProjectSettingsLink()}
              label="Settings"
              icon={<PiGearLight />}
              isActive={isProjectSettingsActive}
            />
          )}
          {/*  <NavigationButton*/}
          {/*    to={linkMaker.makeProjectApiKeysLink()}*/}
          {/*    label="API Keys"*/}
          {/*    icon={<PiKeyLight />}*/}
          {/*    isActive={isProjectApiKeysActive}*/}
          {/*  />*/}
        </CollapsibleGroupButton>
      </Flex>

      <SearchModal model={searchModel} />
    </VStack>
  )
})
