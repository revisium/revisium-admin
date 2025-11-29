import { Box, Button, Flex, Heading, Input, Portal, Stack, Text, VStack } from '@chakra-ui/react'
import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@chakra-ui/react/dialog'
import { Switch } from '@chakra-ui/react/switch'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ProjectSettingsPageModel } from 'src/pages/ProjectSettingsPage/model/ProjectSettingsPageModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'

export const ProjectSettingsPage: React.FC = observer(() => {
  const store = useViewModel(ProjectSettingsPageModel)

  return (
    <Page sidebar={<ProjectSidebar />}>
      <Box maxWidth="600px" width="100%">
        <VStack align="stretch" gap="2rem">
          <Heading size="lg">Project Settings</Heading>

          <Stack gap="1.5rem">
            <Box>
              <Text fontSize="sm" fontWeight="600" color="gray.600" mb="0.5rem">
                Project Name
              </Text>
              <Text fontSize="md" fontWeight="500" color="gray.800">
                {store.projectName}
              </Text>
            </Box>

            {store.canUpdateProject && (
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.600" mb="0.5rem">
                  Visibility
                </Text>
                <Flex alignItems="center" gap="0.5rem">
                  <Switch.Root
                    checked={store.isPublic}
                    onCheckedChange={(details) => store.setIsPublic(details.checked)}
                    colorPalette="gray"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                  <Text fontSize="sm" color="gray.600">
                    {store.isPublic
                      ? 'Public - Anyone can view this project and query data via GraphQL and REST API'
                      : 'Private - Only you can access this project'}
                  </Text>
                </Flex>
              </Box>
            )}

            {store.hasDeletePermission && (
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.600" mb="0.5rem">
                  Danger Zone
                </Text>
                <Box borderWidth="1px" borderColor="red.200" borderRadius="md" padding="1rem" bg="red.50">
                  <VStack align="stretch" gap="0.75rem">
                    <Text fontSize="sm" fontWeight="500" color="red.800">
                      Delete this project
                    </Text>
                    <Text fontSize="sm" color="red.600">
                      Once you delete a project, there is no going back. Please be certain.
                    </Text>

                    <DialogRoot
                      open={store.isDeleteDialogOpen}
                      onOpenChange={(e) => (e.open ? store.openDeleteDialog() : store.closeDeleteDialog())}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" colorScheme="red" size="sm" alignSelf="flex-start">
                          Delete project
                        </Button>
                      </DialogTrigger>

                      <Portal>
                        <DialogBackdrop />
                        <DialogPositioner>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Project</DialogTitle>
                            </DialogHeader>

                            <DialogBody>
                              <VStack align="stretch" gap="1rem">
                                <Text>
                                  This action <strong>cannot be undone</strong>. This will permanently delete the{' '}
                                  <strong>{store.projectName}</strong> project and all of its data.
                                </Text>

                                <Box>
                                  <Text fontSize="sm" fontWeight="500" mb="0.5rem">
                                    Please type "{store.projectName}" to confirm
                                  </Text>
                                  <Input
                                    value={store.deleteConfirmationText}
                                    onChange={(e) => store.setDeleteConfirmationText(e.target.value)}
                                    placeholder={store.projectName}
                                  />
                                </Box>
                              </VStack>
                            </DialogBody>

                            <DialogFooter>
                              <DialogActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogActionTrigger>
                              <Button
                                colorScheme="red"
                                disabled={!store.canDeleteProject}
                                onClick={store.deleteProject}
                              >
                                I understand the consequences, delete this project
                              </Button>
                            </DialogFooter>

                            <DialogCloseTrigger />
                          </DialogContent>
                        </DialogPositioner>
                      </Portal>
                    </DialogRoot>
                  </VStack>
                </Box>
              </Box>
            )}
          </Stack>
        </VStack>
      </Box>
    </Page>
  )
})
