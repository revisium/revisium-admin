import { Box, Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import { Breadcrumb } from '@chakra-ui/react/breadcrumb'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ADMIN_ROUTE, ADMIN_USERS_ROUTE } from 'src/shared/config/routes'
import { useViewModel } from 'src/shared/lib'
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

  return (
    <Flex flexDirection="column" height="100%">
      <Flex
        alignItems="center"
        backgroundColor="white"
        justifyContent="space-between"
        width="100%"
        position="sticky"
        zIndex={1}
        top={0}
        padding="8px"
      >
        <Flex alignItems="center" gap="4px" height="40px">
          <Breadcrumb.Root color="gray" fontWeight="600" fontSize="16px">
            <Breadcrumb.List fontSize="16px">
              <Breadcrumb.Item>
                <Breadcrumb.Link asChild color="gray">
                  <Link to={`/${ADMIN_ROUTE}`}>Admin</Link>
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator>
                <Text color="gray">/</Text>
              </Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.Link asChild color="gray">
                  <Link to={`/${ADMIN_ROUTE}/${ADMIN_USERS_ROUTE}`}>Users</Link>
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator>
                <Text color="gray">/</Text>
              </Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.CurrentLink color="gray">{model.username || userId}</Breadcrumb.CurrentLink>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </Flex>
      </Flex>

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
    </Flex>
  )
})
