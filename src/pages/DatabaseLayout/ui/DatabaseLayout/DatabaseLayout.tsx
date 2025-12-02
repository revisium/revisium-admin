import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { ReadonlyBanner } from 'src/pages/BranchPage/ui/ReadonlyBanner/ReadonlyBanner.tsx'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { Page } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'

export const DatabaseLayout: React.FC = observer(() => {
  const projectPageModel = useProjectPageModel()

  const showReadonlyBanner = !projectPageModel.isDraftRevision

  return (
    <Page sidebar={<ProjectSidebar />}>
      <Flex flex={1} flexDirection="column" position="relative">
        <Outlet />
        {showReadonlyBanner && <ReadonlyBanner />}
      </Flex>
    </Page>
  )
})
