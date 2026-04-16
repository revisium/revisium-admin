import { Badge, Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LimitsPageViewModel } from 'src/pages/OrganizationLimitsPage/model/LimitsPageViewModel.ts'
import { PlanItemViewModel } from 'src/pages/OrganizationLimitsPage/model/PlanItemViewModel.ts'

interface PlanCardProps {
  model: PlanItemViewModel
  parentModel: LimitsPageViewModel
}

export const PlanCard: FC<PlanCardProps> = observer(({ model, parentModel }) => {
  return (
    <Box
      borderWidth="1px"
      borderColor={model.isCurrent ? 'gray.400' : 'gray.200'}
      borderRadius="lg"
      p={4}
      bg="white"
      flex={1}
    >
      <VStack align="start" gap={3}>
        <HStack gap={2}>
          <Text fontSize="md" fontWeight="600" color="gray.700">
            {model.name}
          </Text>
          {model.isCurrent && (
            <Badge colorPalette="gray" variant="subtle" size="sm">
              Current
            </Badge>
          )}
        </HStack>
        <Text fontSize="xl" fontWeight="700" color="gray.800">
          {model.price}
        </Text>
        <VStack align="start" gap={1}>
          <Text fontSize="xs" color="gray.500">
            {model.projectsLimit} projects
          </Text>
          <Text fontSize="xs" color="gray.500">
            {model.membersLimit} members
          </Text>
          <Text fontSize="xs" color="gray.500">
            {model.rowVersionsLimit} row versions
          </Text>
          <Text fontSize="xs" color="gray.500">
            {model.storageLimit} storage
          </Text>
          <Text fontSize="xs" color="gray.500">
            {model.endpointsPerProjectLimit} endpoints / project
          </Text>
        </VStack>
        <Button
          size="sm"
          variant={model.isCurrent ? 'outline' : 'solid'}
          width="100%"
          disabled={model.buttonDisabled || parentModel.isActionLoading}
          onClick={model.handleClick}
        >
          {model.buttonLabel}
        </Button>
      </VStack>
    </Box>
  )
})
