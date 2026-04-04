import { Box, Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LimitsPageViewModel } from 'src/pages/OrganizationLimitsPage/model/LimitsPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { OrganizationSidebar } from 'src/widgets/OrganizationSidebar'
import { IntervalToggle } from 'src/pages/OrganizationLimitsPage/ui/IntervalToggle/IntervalToggle.tsx'
import { PaymentSection } from 'src/pages/OrganizationLimitsPage/ui/PaymentSection/PaymentSection.tsx'
import { PlanCard } from 'src/pages/OrganizationLimitsPage/ui/PlanCard/PlanCard.tsx'
import { StatusBanner } from 'src/pages/OrganizationLimitsPage/ui/StatusBanner/StatusBanner.tsx'
import { UsageMetricCard } from 'src/pages/OrganizationLimitsPage/ui/UsageMetricCard/UsageMetricCard.tsx'

export const OrganizationLimitsPage: FC = observer(() => {
  const model = useViewModel(LimitsPageViewModel)

  if (model.isLoading) {
    return (
      <Page sidebar={<OrganizationSidebar />}>
        <VStack flex={1} justifyContent="center" py="4rem">
          <Spinner size="md" color="gray.400" />
        </VStack>
      </Page>
    )
  }

  if (model.isError) {
    return (
      <Page sidebar={<OrganizationSidebar />}>
        <VStack flex={1} justifyContent="center" gap="8px" color="gray.400" py="4rem">
          <Text fontSize="md">Could not load usage data</Text>
          <Text fontSize="sm">Please retry later</Text>
        </VStack>
      </Page>
    )
  }

  return (
    <Page sidebar={<OrganizationSidebar />}>
      <Box maxWidth="700px" width="100%" mb="4rem">
        <VStack align="stretch" gap="2rem">
          <Box>
            <Text fontSize="20px" fontWeight="600" color="newGray.500" mb={1}>
              {model.pageTitle}
            </Text>
            <Text fontSize="xs" color="newGray.400">
              {model.pageSubtitle}
            </Text>
          </Box>

          <StatusBanner model={model} />

          <Box>
            <Text fontSize="sm" fontWeight="600" color="gray.600" mb={3}>
              Usage
            </Text>
            <Flex gap={3} flexWrap="wrap">
              {model.usageItems.map((item) => (
                <Box key={item.label} flex="1" minWidth="150px">
                  <UsageMetricCard model={item} />
                </Box>
              ))}
            </Flex>
          </Box>

          {model.billingEnabled && model.planItems.length > 0 && (
            <Box>
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text fontSize="sm" fontWeight="600" color="gray.600">
                  Plans
                </Text>
                <IntervalToggle model={model} />
              </Flex>
              <Flex gap={3} flexWrap="wrap">
                {model.planItems.map((plan) => (
                  <PlanCard key={plan.id} model={plan} parentModel={model} />
                ))}
              </Flex>
            </Box>
          )}

          {model.billingEnabled && <PaymentSection model={model} />}
        </VStack>
      </Box>
    </Page>
  )
})
