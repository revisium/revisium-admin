import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { ReadonlyBanner } from 'src/pages/BranchPage/ui/ReadonlyBanner/ReadonlyBanner.tsx'
import { container } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'

export const DatabaseLayout: React.FC = observer(() => {
  const projectContext = container.get(ProjectContext)

  const showReadonlyBanner = !projectContext.isDraftRevision

  return (
    <Page sidebar={<ProjectSidebar />}>
      <Flex flex={1} flexDirection="column" position="relative" marginTop="-12px">
        {showReadonlyBanner && <ReadonlyBanner />}
        <Outlet />
      </Flex>
    </Page>
  )
})
