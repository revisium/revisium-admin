import { Box, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ADMIN_ROUTE, ADMIN_USERS_ROUTE } from 'src/shared/config/routes'
import { useViewModel } from 'src/shared/lib'
import { AdminPageLayout, BreadcrumbItem } from 'src/shared/ui/AdminPageLayout'
import { AdminUserDetailViewModel } from '../../model/AdminUserDetailViewModel'
import { InfoRow } from '../InfoRow'
import { ResetPasswordSection } from '../ResetPasswordSection'

export const AdminUserDetailPage: FC = observer(() => {
  const { userId } = useParams<{ userId: string }>()
  const model = useViewModel(AdminUserDetailViewModel)

  useEffect(() => {
    if (userId) {
      model.setUserId(userId)
    }
  }, [userId, model])

  const breadcrumbs: BreadcrumbItem[] = useMemo(
    () => [{ label: 'Users', to: `/${ADMIN_ROUTE}/${ADMIN_USERS_ROUTE}` }, { label: model.username || userId || '' }],
    [model.username, userId],
  )

  return (
    <AdminPageLayout breadcrumbs={breadcrumbs}>
      <Box flex={1} padding="8px">
        {model.isLoading && (
          <VStack flex={1} justifyContent="center" paddingY="48px">
            <Spinner size="md" color="gray.400" />
          </VStack>
        )}

        {model.error && (
          <VStack flex={1} justifyContent="center" gap="8px" color="gray.400" paddingY="48px">
            <Text fontSize="md">Could not load user</Text>
            <Text fontSize="sm">{model.error}</Text>
          </VStack>
        )}

        {!model.isLoading && !model.error && !model.user && (
          <VStack flex={1} justifyContent="center" gap="8px" color="gray.400" paddingY="48px">
            <Text fontSize="md">User not found</Text>
          </VStack>
        )}

        {model.user && (
          <>
            <Box padding="16px" borderWidth="1px" borderColor="newGray.100" borderRadius="md">
              <Text fontSize="sm" fontWeight="500" color="newGray.500" marginBottom="12px">
                User Info
              </Text>
              <VStack alignItems="flex-start" gap="8px">
                <InfoRow label="ID" value={model.user.id} />
                <InfoRow label="Username" value={model.username} />
                <InfoRow label="Email" value={model.email} />
                <InfoRow label="Role" value={model.roleName} />
              </VStack>
            </Box>
            <ResetPasswordSection model={model} />
          </>
        )}
      </Box>
    </AdminPageLayout>
  )
})
