import { Box, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiCheckCircleLight, PiXCircleLight } from 'react-icons/pi'
import { ApplyMigrationResult } from 'src/pages/MigrationsPage/api/MigrationsDataSource.ts'
import { ApplyResultSummary } from 'src/pages/MigrationsPage/model/BaseApplyMigrationsDialogViewModel.ts'

interface ApplyResultSectionProps {
  summary: ApplyResultSummary
  failedResults: ApplyMigrationResult[]
}

export const ApplyResultSection: FC<ApplyResultSectionProps> = observer(({ summary, failedResults }) => {
  return (
    <VStack align="stretch" gap={3} p={4} bg={summary.hasFailures ? 'red.50' : 'green.50'} borderRadius="md">
      <HStack>
        <Icon
          as={summary.hasFailures ? PiXCircleLight : PiCheckCircleLight}
          color={summary.hasFailures ? 'red.500' : 'green.500'}
          boxSize={5}
        />
        <Text fontWeight="500" color={summary.hasFailures ? 'red.700' : 'green.700'}>
          {summary.hasFailures ? 'Apply failed' : 'Successfully applied'}
        </Text>
      </HStack>

      <HStack gap={4}>
        {summary.applied > 0 && (
          <Text fontSize="sm" color="green.600">
            {summary.applied} applied
          </Text>
        )}
        {summary.skipped > 0 && (
          <Text fontSize="sm" color="gray.500">
            {summary.skipped} skipped
          </Text>
        )}
        {summary.failed > 0 && (
          <Text fontSize="sm" color="red.600">
            {summary.failed} failed
          </Text>
        )}
      </HStack>

      {failedResults.map((r) => (
        <Box key={r.id} p={2} bg="red.100" borderRadius="sm">
          <Text fontSize="sm" color="red.700">
            {r.id}: {r.error}
          </Text>
        </Box>
      ))}
    </VStack>
  )
})
