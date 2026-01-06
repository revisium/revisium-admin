import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { ReadonlyBanner } from 'src/pages/BranchPage/ui/ReadonlyBanner/ReadonlyBanner.tsx'
import { container } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { BranchPageTitleWidget } from 'src/widgets/BranchPageTitleWidget'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'

interface BranchPageProps {
  showTitle?: boolean
}

export const BranchPage: React.FC<BranchPageProps> = observer(({ showTitle = true }) => {
  const projectContext = container.get(ProjectContext)

  const showReadonlyBanner = !projectContext.isDraftRevision

  return (
    <Page sidebar={<ProjectSidebar />} title={showTitle ? <BranchPageTitleWidget /> : undefined}>
      <Flex flex={1} flexDirection="column" gap="1rem" position="relative">
        <Flex flexDirection="column" gap="0.5rem" flex={1}>
          <Outlet />
        </Flex>

        {showReadonlyBanner && <ReadonlyBanner />}
      </Flex>
    </Page>
  )
})
