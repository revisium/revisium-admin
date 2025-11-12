import { Flex, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import {
  PiGearLight,
  // PiKeyLight,
  // PiUsersLight,
  PiDatabaseThin,
  PiSliders,
  // PiFileTextLight,
  // PiFileLight,
  PiListLight,
  PiMagnifyingGlassLight,
  PiGitBranchLight,
} from 'react-icons/pi'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { MIGRATIONS_ROUTE } from 'src/shared/config/routes.ts'
import { useNavigationState } from 'src/widgets/ProjectSidebar/hooks/useNavigationState.ts'
import { ProjectSidebarViewModel } from 'src/widgets/ProjectSidebar/model/ProjectSidebarViewModel.ts'
import { CollapsibleGroupButton } from 'src/widgets/ProjectSidebar/ui/CollapsibleGroupButton/CollapsibleGroupButton.tsx'
import { NavigationButton } from 'src/widgets/ProjectSidebar/ui/NavigationButton/NavigationButton.tsx'
import { ProjectButton } from 'src/widgets/ProjectSidebar/ui/ProjectButton/ProjectButton.tsx'
import { BranchWidget } from 'src/widgets/SidebarBranchWidget'
import { useViewModel } from 'src/shared/lib'
import { SearchModal, SearchModalModel } from 'src/widgets/SearchModal'

export const ProjectSidebar: FC = observer(() => {
  const model = useViewModel(ProjectSidebarViewModel)
  const searchModel = useViewModel(SearchModalModel)

  const linkMaker = useLinkMaker()

  const { isTablesActive, isMigrationsActive, isProjectSettingsActive } = useNavigationState()

  return (
    <VStack alignItems="flex-start" gap={0}>
      <ProjectButton name={model.projectName} isPublic={model.isProjectPublic} />

      <Flex flexDirection="column" width="100%" mt={4} gap={1}>
        <NavigationButton
          label="Search"
          icon={<PiMagnifyingGlassLight />}
          isActive={false}
          onClick={() => searchModel.openModal()}
        />

        <CollapsibleGroupButton
          icon={<PiGitBranchLight />}
          label={<BranchWidget />}
          isExpanded={model.isBranchSectionExpanded}
          onClick={model.handleBranchSectionClick}
          disableLabelClick={true}
        >
          <NavigationButton
            to={linkMaker.currentBaseLink}
            label="Database"
            icon={<PiDatabaseThin />}
            isActive={isTablesActive}
          />
          {/*<NavigationButton*/}
          {/*  to={`${linkMaker.makeProjectSettingsLink}/-/changes`}*/}
          {/*  label="Changes"*/}
          {/*  icon={<PiFileTextLight />}*/}
          {/*  isActive={isChangesActive}*/}
          {/*/>*/}
          {/*<NavigationButton*/}
          {/*  to={`${linkMaker.currentBaseLink}/-/assets`}*/}
          {/*  label="Assets"*/}
          {/*  icon={<PiFileLight />}*/}
          {/*  isActive={isAssetsActive}*/}
          {/*/>*/}
          <NavigationButton
            to={`${linkMaker.currentBaseLink}/${MIGRATIONS_ROUTE}`}
            label="Migrations"
            icon={<PiListLight />}
            isActive={isMigrationsActive}
          />
        </CollapsibleGroupButton>

        <CollapsibleGroupButton
          icon={<PiSliders />}
          label="Management"
          isExpanded={model.isProjectSectionExpanded}
          onClick={model.handleProjectSectionClick}
        >
          <NavigationButton
            to={linkMaker.makeProjectSettingsLink()}
            label="Settings"
            icon={<PiGearLight />}
            isActive={isProjectSettingsActive}
          />
          {/*  <NavigationButton*/}
          {/*    to={linkMaker.makeProjectUsersLink()}*/}
          {/*    label="Users"*/}
          {/*    icon={<PiUsersLight />}*/}
          {/*    isActive={isProjectUsersActive}*/}
          {/*  />*/}
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
