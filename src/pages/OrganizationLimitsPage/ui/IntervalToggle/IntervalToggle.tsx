import { Button, HStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LimitsPageViewModel } from 'src/pages/OrganizationLimitsPage/model/LimitsPageViewModel.ts'

interface IntervalToggleProps {
  model: LimitsPageViewModel
}

export const IntervalToggle: FC<IntervalToggleProps> = observer(({ model }) => {
  return (
    <HStack gap={2}>
      <Button
        size="xs"
        variant={model.billingInterval === 'monthly' ? 'solid' : 'outline'}
        onClick={() => model.setBillingInterval('monthly')}
      >
        Monthly
      </Button>
      <Button
        size="xs"
        variant={model.billingInterval === 'yearly' ? 'solid' : 'outline'}
        onClick={() => model.setBillingInterval('yearly')}
      >
        Yearly
      </Button>
    </HStack>
  )
})
