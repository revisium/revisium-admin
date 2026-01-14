import { Box, Flex, Separator, Spacer, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import {
  PiGearLight,
  PiGitBranchLight,
  // PiKeyLight,
  PiUsersLight,
  PiDatabaseLight,
  PiFileTextLight,
  PiImageLight,
  PiShuffleLight,
  PiMagnifyingGlassLight,
  PiPlugLight,
  PiRobotLight,
  PiGraphLight,
  PiTreeStructureLight,
} from 'react-icons/pi'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import {
  ASSETS_ROUTE,
  BRANCH_MAP_ROUTE,
  CHANGES_ROUTE,
  MIGRATIONS_ROUTE,
  RELATIONS_ROUTE,
} from 'src/shared/config/routes.ts'
import { useNavigationState } from 'src/widgets/ProjectSidebar/hooks/useNavigationState.ts'
import { ProjectSidebarViewModel } from 'src/widgets/ProjectSidebar/model/ProjectSidebarViewModel.ts'
import { CollapsibleGroupButton } from 'src/widgets/ProjectSidebar/ui/CollapsibleGroupButton/CollapsibleGroupButton.tsx'
import { NavigationButton } from 'src/widgets/ProjectSidebar/ui/NavigationButton/NavigationButton.tsx'
import { ProjectHeader } from 'src/widgets/ProjectSidebar/ui/ProjectButton/ProjectButton.tsx'
import { BranchWidget } from 'src/widgets/SidebarBranchWidget'
import { useViewModel } from 'src/shared/lib'
import { SearchModal, SearchModalModel } from 'src/widgets/SearchModal'
import { AccountButton } from 'src/widgets/AccountButton'

export const ProjectSidebar: FC = observer(() => {
  const model = useViewModel(ProjectSidebarViewModel)
  const searchModel = useViewModel(SearchModalModel)

  const linkMaker = useLinkMaker()

  const {
    isTablesActive,
    isChangesActive,
    isAssetsActive,
    isMigrationsActive,
    isRelationsActive,
    isBranchMapActive,
    isProjectSettingsActive,
    isEndpointsActive,
    isBranchesActive,
    isProjectUsersActive,
    isMcpActive,
    isProjectLevelActive,
    isBranchesLevelActive,
  } = useNavigationState()

  useEffect(() => {
    if (isProjectLevelActive) {
      model.expandProjectSection()
    }
  }, [isProjectLevelActive, model])

  useEffect(() => {
    if (isBranchesLevelActive) {
      model.expandBranchesSection()
    }
  }, [isBranchesLevelActive, model])

  return (
    <VStack alignItems="flex-start" gap={0} width="100%" flex={1}>
      <ProjectHeader
        name={model.projectName}
        organizationName={model.organizationId}
        isPublic={model.isProjectPublic}
        roleName={model.roleName}
      />

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
          />
          <NavigationButton
            to={`${linkMaker.currentBaseLink}/${ASSETS_ROUTE}`}
            label="Assets"
            icon={<PiImageLight />}
            isActive={isAssetsActive}
          />
          <NavigationButton
            to={`${linkMaker.currentBaseLink}/${RELATIONS_ROUTE}`}
            label="Table Relations"
            icon={<PiGraphLight />}
            isActive={isRelationsActive}
          />
          <NavigationButton
            to={`${linkMaker.currentBaseLink}/${MIGRATIONS_ROUTE}`}
            label="Migrations"
            icon={<PiShuffleLight />}
            isActive={isMigrationsActive}
          />
        </CollapsibleGroupButton>

        <CollapsibleGroupButton
          label="Branches"
          isExpanded={model.isBranchesSectionExpanded}
          onClick={model.handleBranchesSectionClick}
        >
          <NavigationButton
            to={linkMaker.makeBranchesLink()}
            label="All Branches"
            icon={<PiGitBranchLight />}
            isActive={isBranchesActive}
          />
          <NavigationButton
            to={`${linkMaker.currentBaseLink}/${BRANCH_MAP_ROUTE}`}
            label="Branch Map"
            icon={<PiTreeStructureLight />}
            isActive={isBranchMapActive}
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
        </CollapsibleGroupButton>
      </Flex>

      <Spacer />

      <Flex flexDirection="column" width="100%" gap={1}>
        <AccountButton />
      </Flex>

      <SearchModal model={searchModel} />
    </VStack>
  )
})
