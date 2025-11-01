import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { ReadonlyBanner } from 'src/pages/BranchPage/ui/ReadonlyBanner/ReadonlyBanner.tsx'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { Page } from 'src/shared/ui'
import { BranchPageTitleWidget } from 'src/widgets/BranchPageTitleWidget'
// import { RevisionEndpointWidget } from 'src/widgets/RevisionEndpointWidget'
import { SidebarWidget } from 'src/widgets/SidebarWidget'

export const BranchPage: React.FC = observer(() => {
  const projectPageModel = useProjectPageModel()

  const showReadonlyBanner = !projectPageModel.isDraftRevision

  return (
    <Page sidebar={<SidebarWidget />} title={<BranchPageTitleWidget />}>
      <Flex flex={1} flexDirection="column" gap="1rem" position="relative">
        {/*<RevisionEndpointWidget />*/}

        <Flex flexDirection="column" gap="0.5rem" flex={1}>
          <Outlet />
        </Flex>

        {showReadonlyBanner && <ReadonlyBanner />}
      </Flex>
    </Page>
  )
})
