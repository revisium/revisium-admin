import { Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { AdminPageLayout } from 'src/shared/ui/AdminPageLayout'

export const AdminOrganizationsPage: FC = () => {
  return (
    <AdminPageLayout breadcrumbs={[{ label: 'Organizations' }]}>
      <VStack flex={1} justifyContent="center" gap="8px" color="gray.400" paddingY="48px">
        <Text fontSize="md">Coming soon</Text>
      </VStack>
    </AdminPageLayout>
  )
}
