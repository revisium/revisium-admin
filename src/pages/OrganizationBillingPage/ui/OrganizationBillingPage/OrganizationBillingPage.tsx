import { Box, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { Page } from 'src/shared/ui'
import { OrganizationSidebar } from 'src/widgets/OrganizationSidebar'

export const OrganizationBillingPage: FC = () => {
  return (
    <Page sidebar={<OrganizationSidebar />}>
      <Box>
        <Text fontSize="20px" fontWeight="600" color="newGray.500">
          Billing
        </Text>
      </Box>
    </Page>
  )
}
