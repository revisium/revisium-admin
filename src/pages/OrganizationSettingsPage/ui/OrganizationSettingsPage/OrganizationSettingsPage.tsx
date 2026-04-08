import { Box, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { ApiKeyList } from 'src/features/ApiKeyManager'
import { OrganizationSettingsPageModel } from 'src/pages/OrganizationSettingsPage/model/OrganizationSettingsPageModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { OrganizationSidebar } from 'src/widgets/OrganizationSidebar'

export const OrganizationSettingsPage: FC = observer(() => {
  const store = useViewModel(OrganizationSettingsPageModel)

  return (
    <Page sidebar={<OrganizationSidebar />}>
      <Box maxWidth="600px" width="100%" mb="4rem">
        <VStack align="stretch" gap="2rem">
          <Box>
            <Text fontSize="20px" fontWeight="600" color="newGray.500" mb={1}>
              API Keys
            </Text>
            <Text fontSize="xs" color="newGray.400">
              Service keys for automated integrations with this organization.
            </Text>
          </Box>

          {store.canManageServiceKeys && <ApiKeyList model={store.apiKeyManager} />}
        </VStack>
      </Box>
    </Page>
  )
})
