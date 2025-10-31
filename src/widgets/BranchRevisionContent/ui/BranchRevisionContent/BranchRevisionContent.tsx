import { Tabs } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { BranchesContent } from 'src/widgets/BranchRevisionContent/ui/BranchesContent/BranchesContent.tsx'

interface BranchRevisionContentProps {
  onClose: () => void
}

export const BranchRevisionContent: FC<BranchRevisionContentProps> = ({ onClose }) => {
  const handleSelect = useCallback(
    (_: string) => {
      onClose()
    },
    [onClose],
  )

  return (
    <Tabs.Root defaultValue="revisions" display="flex" flexDirection="column">
      <Tabs.List>
        <Tabs.Trigger value="revisions">Revisions</Tabs.Trigger>
        <Tabs.Trigger value="branches">Branches</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="revisions">Manage your revisions</Tabs.Content>
      <Tabs.Content value="branches" overflow="hidden">
        <BranchesContent onSelect={handleSelect} />
      </Tabs.Content>
    </Tabs.Root>
  )
}
