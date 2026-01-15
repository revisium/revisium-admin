import {
  Box,
  Button,
  Circle,
  HStack,
  Icon,
  Input,
  Link as ChakraLink,
  Portal,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
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
import { observer } from 'mobx-react-lite'
import React from 'react'
import { PiArrowRightLight, PiCloudLight, PiLockSimpleLight } from 'react-icons/pi'
import { Link as RouterLink } from 'react-router-dom'
import { ProjectSettingsPageModel } from 'src/pages/ProjectSettingsPage/model/ProjectSettingsPageModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'

interface VisibilityCardProps {
  isSelected: boolean
  onClick: () => void
  icon: React.ElementType
  title: string
  description: string
  details: React.ReactNode
  disabled?: boolean
}

const VisibilityCard: React.FC<VisibilityCardProps> = ({
  isSelected,
  onClick,
  icon,
  title,
  description,
  details,
  disabled,
}) => {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      width="100%"
      p={4}
      borderWidth="1px"
      borderColor={isSelected ? 'gray.400' : 'gray.200'}
      borderRadius="lg"
      bg="white"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.6 : 1}
      textAlign="left"
      transition="all 0.2s"
      _hover={disabled ? {} : { borderColor: 'gray.400' }}
    >
      <HStack gap={3} align="flex-start">
        <Circle size="32px" bg="gray.100" flexShrink={0}>
          <Icon as={icon} boxSize={4} color="gray.500" />
        </Circle>
        <VStack align="start" gap={1} flex={1}>
          <HStack gap={2}>
            <Text fontSize="sm" fontWeight="600" color="gray.700">
              {title}
            </Text>
            {isSelected && (
              <Text fontSize="xs" color="gray.500" fontWeight="500">
                Current
              </Text>
            )}
          </HStack>
          <Text fontSize="xs" color="gray.600">
            {description}
          </Text>
          <Box mt={1}>{details}</Box>
        </VStack>
      </HStack>
    </Box>
  )
}

export const ProjectSettingsPage: React.FC = observer(() => {
  const store = useViewModel(ProjectSettingsPageModel)

  return (
    <Page sidebar={<ProjectSidebar />}>
      <Box maxWidth="600px" width="100%" mb="4rem">
        <VStack align="stretch" gap="2rem">
          <Box>
            <Text fontSize="20px" fontWeight="600" color="newGray.500" mb={1}>
              Settings
            </Text>
            <Text fontSize="xs" color="newGray.400">
              Project configuration and access controls.
            </Text>
          </Box>

          <Stack gap="1.5rem">
            <Box>
              <Text fontSize="sm" fontWeight="600" color="gray.600" mb="0.5rem">
                Project Name
              </Text>
              <Text fontSize="md" fontWeight="500" color="gray.800">
                {store.projectName}
              </Text>
            </Box>

            <Box>
              <HStack justify="space-between" align="center" mb={3}>
                <Text fontSize="sm" fontWeight="600" color="gray.600">
                  Visibility
                </Text>
                <ChakraLink asChild fontSize="xs" color="gray.500">
                  <RouterLink to={store.endpointsLink}>
                    View Endpoints
                    <Icon as={PiArrowRightLight} ml={1} />
                  </RouterLink>
                </ChakraLink>
              </HStack>
              <VStack gap={3}>
                <VisibilityCard
                  isSelected={!store.isPublic}
                  onClick={() => store.setIsPublic(false)}
                  icon={PiLockSimpleLight}
                  title="Private"
                  description="Only authorized users can access this project."
                  disabled={!store.canUpdateProject}
                  details={
                    <Text fontSize="xs" color="gray.500">
                      All API operations require authentication.
                    </Text>
                  }
                />
                <VisibilityCard
                  isSelected={store.isPublic}
                  onClick={() => store.setIsPublic(true)}
                  icon={PiCloudLight}
                  title="Public"
                  description="Anyone can view the project and read data."
                  disabled={!store.canUpdateProject}
                  details={
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" color="gray.500">
                        UI and API read operations — no authentication required
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        API write operations — authentication required
                      </Text>
                    </VStack>
                  }
                />
              </VStack>
            </Box>

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
