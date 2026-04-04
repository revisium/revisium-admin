import { Badge, Box, Flex, HStack, Progress, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiQuestionLight } from 'react-icons/pi'
import { UsageItemViewModel } from 'src/pages/OrganizationLimitsPage/model/UsageItemViewModel.ts'
import { Tooltip } from 'src/shared/ui'

interface UsageMetricCardProps {
  model: UsageItemViewModel
}

export const UsageMetricCard: FC<UsageMetricCardProps> = observer(({ model }) => {
  return (
    <Box borderWidth="1px" borderColor="gray.200" borderRadius="lg" p={4} bg="white">
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <HStack gap={1}>
          <Text fontSize="sm" fontWeight="600" color="gray.600">
            {model.label}
          </Text>
          {model.tooltip && (
            <Tooltip content={model.tooltip} showArrow contentProps={{ maxWidth: '280px' }}>
              <Box fontSize="14px" color="gray.400" cursor="help" display="flex" alignItems="center">
                <PiQuestionLight />
              </Box>
            </Tooltip>
          )}
        </HStack>
        {model.isUnlimited && (
          <Badge colorPalette="green" variant="subtle" size="sm">
            Unlimited
          </Badge>
        )}
      </Flex>
      <Text fontSize="lg" fontWeight="600" color="gray.800" mb={model.isUnlimited ? 0 : 2}>
        {model.isUnlimited ? model.current : `${model.current} / ${model.limit}`}
      </Text>
      {!model.isUnlimited && model.percentage !== null && (
        <Progress.Root value={model.percentage} size="sm" colorPalette={model.progressColor} borderRadius="full">
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      )}
    </Box>
  )
})
