import { Badge, Box, Flex, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { SystemApiViewModel } from 'src/pages/EndpointsPage/model/SystemApiViewModel.ts'
import { EndpointActions } from '../EndpointActions/EndpointActions.tsx'

interface SystemApiSectionProps {
  model: SystemApiViewModel
}

export const SystemApiSection: FC<SystemApiSectionProps> = observer(({ model }) => {
  return (
    <Box>
      <Text fontSize="xs" color="newGray.400" mb={4}>
        Full access to Revisium management API for projects, branches, revisions, tables, and data. REST API is used by{' '}
        <Link
          href="https://github.com/revisium/revisium-cli"
          target="_blank"
          rel="noopener noreferrer"
          color="blue.500"
        >
          revisium-cli
        </Link>{' '}
        for CI/CD automation.
      </Text>

      <VStack align="stretch" gap={2}>
        <Box
          className="group"
          p={3}
          borderWidth="1px"
          borderColor="newGray.200"
          borderRadius="8px"
          backgroundColor="white"
          _hover={{ borderColor: 'newGray.300' }}
          width="100%"
          height="48px"
          transition="all 0.15s"
        >
          <Flex justify="space-between" align="center" gap={3} height="100%">
            <Flex align="center" gap={2} flex={1} minWidth={0}>
              <Badge size="sm" colorPalette="green" variant="subtle" fontWeight="500">
                REST API
              </Badge>
              <Text fontSize="14px" fontWeight="500" color="newGray.600">
                System
              </Text>
            </Flex>

            <HStack gap={2}>
              <HStack opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.15s">
                <EndpointActions
                  copyTooltip="Copy REST API URL"
                  swaggerUrl={model.restApiSwaggerUrl}
                  onCopy={model.copyRestApiUrl}
                />
              </HStack>
            </HStack>
          </Flex>
        </Box>

        <Box
          className="group"
          p={3}
          borderWidth="1px"
          borderColor="newGray.200"
          borderRadius="8px"
          backgroundColor="white"
          _hover={{ borderColor: 'newGray.300' }}
          width="100%"
          height="48px"
          transition="all 0.15s"
        >
          <Flex justify="space-between" align="center" gap={3} height="100%">
            <Flex align="center" gap={2} flex={1} minWidth={0}>
              <Badge size="sm" colorPalette="pink" variant="subtle" fontWeight="500">
                GraphQL
              </Badge>
              <Text fontSize="14px" fontWeight="500" color="newGray.600">
                System
              </Text>
            </Flex>

            <HStack gap={2}>
              <HStack opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.15s">
                <EndpointActions
                  copyTooltip="Copy GraphQL URL"
                  sandboxUrl={model.graphqlSandboxUrl}
                  onCopy={model.copyGraphqlUrl}
                />
              </HStack>
            </HStack>
          </Flex>
        </Box>
      </VStack>
    </Box>
  )
})
