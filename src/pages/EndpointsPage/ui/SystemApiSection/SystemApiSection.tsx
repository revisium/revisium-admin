import { Box, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { SystemApiViewModel } from 'src/pages/EndpointsPage/model/SystemApiViewModel.ts'
import { SystemApiRow } from '../SystemApiRow/SystemApiRow'

interface SystemApiSectionProps {
  model: SystemApiViewModel
}

export const SystemApiSection: FC<SystemApiSectionProps> = observer(({ model }) => {
  return (
    <Box mt={8} p={4} borderWidth="1px" borderColor="newGray.100" borderRadius="md">
      <Text fontSize="sm" fontWeight="500" color="newGray.500" mb={1}>
        System API
      </Text>
      <Text fontSize="xs" color="newGray.400" mb={3}>
        Full access to Revisium management API for projects, branches, revisions, tables, and data
      </Text>
      <VStack align="stretch" gap={2}>
        <SystemApiRow label="REST API" url={model.restApiUrl} onCopy={() => model.copyUrl(model.restApiUrl)} />
        <SystemApiRow label="GraphQL" url={model.graphqlUrl} onCopy={() => model.copyUrl(model.graphqlUrl)} />
      </VStack>
    </Box>
  )
})
