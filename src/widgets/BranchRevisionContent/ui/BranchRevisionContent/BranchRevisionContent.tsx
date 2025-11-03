import { Tabs } from '@chakra-ui/react'
import { FC } from 'react'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { BranchesContent } from 'src/widgets/BranchRevisionContent/ui/BranchesContent/BranchesContent.tsx'
import { RevisionsContent } from 'src/widgets/BranchRevisionContent/ui/RevisionsContent/RevisionsContent.tsx'

export const BranchRevisionContent: FC = () => {
  const projectPageModel = useProjectPageModel()

  return (
    <Tabs.Root lazyMount defaultValue="revisions" display="flex" flexDirection="column">
      <Tabs.List>
        <Tabs.Trigger value="branches">Branches</Tabs.Trigger>
        <Tabs.Trigger value="revisions">Revisions [{projectPageModel.routeBranchName}]</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="branches" overflow="hidden">
        <BranchesContent />
      </Tabs.Content>
      <Tabs.Content value="revisions" overflow="hidden">
        <RevisionsContent project={projectPageModel} />
      </Tabs.Content>
    </Tabs.Root>
  )
}
