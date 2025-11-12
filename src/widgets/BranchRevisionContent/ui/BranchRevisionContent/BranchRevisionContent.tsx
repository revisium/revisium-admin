import { Tabs } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useViewModel } from 'src/shared/lib'
import { BranchRevisionContentModel } from 'src/widgets/BranchRevisionContent/model/BranchRevisionContentModel.ts'
import { BranchesContent } from 'src/widgets/BranchRevisionContent/ui/BranchesContent/BranchesContent.tsx'
import { RevisionsContent } from 'src/widgets/BranchRevisionContent/ui/RevisionsContent/RevisionsContent.tsx'

export const BranchRevisionContent: FC = observer(() => {
  const model = useViewModel(BranchRevisionContentModel)

  return (
    <Tabs.Root lazyMount defaultValue="revisions" display="flex" flexDirection="column">
      <Tabs.List>
        <Tabs.Trigger value="branches">Branches</Tabs.Trigger>
        <Tabs.Trigger value="revisions">{model.revisionsTitle}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="branches" overflow="hidden">
        <BranchesContent />
      </Tabs.Content>
      <Tabs.Content value="revisions" overflow="hidden">
        <RevisionsContent />
      </Tabs.Content>
    </Tabs.Root>
  )
})
