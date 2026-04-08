import { Box, Link as ChakraLink, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiArrowRightLight } from 'react-icons/pi'
import { Link as RouterLink } from 'react-router-dom'
import { ApiKeyList } from 'src/features/ApiKeyManager'
import { ProjectApiKeysPageModel } from 'src/pages/ProjectApiKeysPage/model/ProjectApiKeysPageModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'

export const ProjectApiKeysPage: FC = observer(() => {
  const store = useViewModel(ProjectApiKeysPageModel)

  return (
    <Page sidebar={<ProjectSidebar />}>
      <Box maxWidth="600px" width="100%" mb="4rem">
        <VStack align="stretch" gap="2rem">
          <Box>
            <Text fontSize="20px" fontWeight="600" color="newGray.500" mb={1}>
              API Keys
            </Text>
            <Text fontSize="xs" color="newGray.400">
              Service keys scoped to this project for automated integrations.
            </Text>
          </Box>

          {store.canManageServiceKeys ? (
            <Box>
              <ApiKeyList model={store.apiKeyManager} />
              <ChakraLink asChild fontSize="xs" color="gray.500" mt={3} display="inline-flex" alignItems="center">
                <RouterLink to={store.organizationSettingsLink}>
                  Manage all organization keys
                  <PiArrowRightLight style={{ marginLeft: '4px' }} />
                </RouterLink>
              </ChakraLink>
            </Box>
          ) : (
            <Box p={6} textAlign="center" borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="gray.50">
              <Text fontSize="sm" color="gray.500" mb={2}>
                No API keys scoped to this project.
              </Text>
              <ChakraLink asChild fontSize="xs" color="blue.500">
                <RouterLink to={store.organizationSettingsLink}>
                  Contact an organization admin to manage API keys
                  <PiArrowRightLight style={{ marginLeft: '4px' }} />
                </RouterLink>
              </ChakraLink>
            </Box>
          )}
        </VStack>
      </Box>
    </Page>
  )
})
