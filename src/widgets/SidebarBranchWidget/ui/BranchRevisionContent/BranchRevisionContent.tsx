import { Tabs } from '@chakra-ui/react'

export const BranchRevisionContent = () => {
  return (
    <Tabs.Root defaultValue="members">
      <Tabs.List>
        <Tabs.Trigger value="members">Revisions</Tabs.Trigger>
        <Tabs.Trigger value="projects">Branches</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="members">Manage your team members</Tabs.Content>
      <Tabs.Content value="projects">Manage your projects</Tabs.Content>
    </Tabs.Root>
  )
}
