import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { ReadonlyBanner } from 'src/pages/BranchPage/ui/ReadonlyBanner/ReadonlyBanner.tsx'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { Page } from 'src/shared/ui'
import { AccountButton } from 'src/widgets/AccountButton'
import { BranchPageTitleWidget } from 'src/widgets/BranchPageTitleWidget'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'

interface BranchPageProps {
  showTitle?: boolean
}

export const BranchPage: React.FC<BranchPageProps> = observer(({ showTitle = true }) => {
  const projectPageModel = useProjectPageModel()

  const showReadonlyBanner = !projectPageModel.isDraftRevision

  return (
    <Page
      sidebar={<ProjectSidebar />}
      title={showTitle ? <BranchPageTitleWidget /> : undefined}
      footer={<AccountButton />}
    >
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
