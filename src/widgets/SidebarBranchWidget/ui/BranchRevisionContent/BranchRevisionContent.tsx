import { Tabs } from '@chakra-ui/react'

export const BranchRevisionContent = () => {
  return (
    <Tabs.Root defaultValue="revisions">
      <Tabs.List>
        <Tabs.Trigger value="revisions">Revisions</Tabs.Trigger>
        <Tabs.Trigger value="branches">Branches</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="revisions">Manage your revisions</Tabs.Content>
      <Tabs.Content value="branches">Manage your branches</Tabs.Content>
    </Tabs.Root>
  )
}
