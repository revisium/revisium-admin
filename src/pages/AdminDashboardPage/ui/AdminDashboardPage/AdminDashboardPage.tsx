import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { Breadcrumb } from '@chakra-ui/react/breadcrumb'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useViewModel } from 'src/shared/lib'
import { AdminDashboardViewModel } from '../../model/AdminDashboardViewModel'

interface StatCardProps {
  label: string
  value: number | null
  isLoading: boolean
}

const StatCard: FC<StatCardProps> = ({ label, value, isLoading }) => {
  return (
    <Box
      padding="24px"
      borderRadius="8px"
      border="1px solid"
      borderColor="gray.200"
      backgroundColor="white"
      minWidth="200px"
    >
      <Text fontSize="sm" color="gray.500" marginBottom="8px">
        {label}
      </Text>
      {isLoading ? (
        <Spinner size="sm" color="gray.400" />
      ) : (
        <Text fontSize="2xl" fontWeight="600" color="gray.900">
          {value ?? '-'}
        </Text>
      )}
    </Box>
  )
}

export const AdminDashboardPage: FC = observer(() => {
  const model = useViewModel(AdminDashboardViewModel)

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
                <Breadcrumb.CurrentLink color="gray">Admin</Breadcrumb.CurrentLink>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </Flex>
      </Flex>

      <Box padding="8px" paddingTop="16px">
        <Flex gap="16px" flexWrap="wrap">
          <StatCard label="Total Users" value={model.usersCount} isLoading={model.isLoadingUsers} />
          <StatCard label="Total Projects" value={model.projectsCount} isLoading={model.isLoadingProjects} />
        </Flex>
      </Box>
    </Flex>
  )
})
