import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { Breadcrumb } from '@chakra-ui/react/breadcrumb'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ADMIN_ROUTE } from 'src/shared/config/routes'

export const AdminOrganizationsPage: FC = () => {
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
                <Breadcrumb.CurrentLink color="gray">Organizations</Breadcrumb.CurrentLink>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </Flex>
      </Flex>

      <Box flex={1}>
        <VStack flex={1} justifyContent="center" gap="8px" color="gray.400" paddingY="48px">
          <Text fontSize="md">Coming soon</Text>
        </VStack>
      </Box>
    </Flex>
  )
}
