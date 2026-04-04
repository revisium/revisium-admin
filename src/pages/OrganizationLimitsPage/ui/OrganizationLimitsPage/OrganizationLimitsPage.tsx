import { Badge, Box, Button, Flex, HStack, Portal, Progress, Spinner, Text, VStack } from '@chakra-ui/react'
import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from '@chakra-ui/react/dialog'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiQuestionLight } from 'react-icons/pi'
import { LimitsPagePlanFragment } from 'src/__generated__/graphql-request.ts'
import { LimitsPageViewModel, UsageItem } from 'src/pages/OrganizationLimitsPage/model/LimitsPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page, Tooltip } from 'src/shared/ui'
import { OrganizationSidebar } from 'src/widgets/OrganizationSidebar'

// --- Usage ---

const UsageMetricCard: FC<{ item: UsageItem }> = observer(({ item }) => {
  const isUnlimited = item.limit === 'Unlimited'

  return (
    <Box borderWidth="1px" borderColor="gray.200" borderRadius="lg" p={4} bg="white">
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <HStack gap={1}>
          <Text fontSize="sm" fontWeight="600" color="gray.600">
            {item.label}
          </Text>
          {item.tooltip && (
            <Tooltip content={item.tooltip} showArrow contentProps={{ maxWidth: '280px' }}>
              <Box fontSize="14px" color="gray.400" cursor="help" display="flex" alignItems="center">
                <PiQuestionLight />
              </Box>
            </Tooltip>
          )}
        </HStack>
        {isUnlimited && (
          <Badge colorPalette="green" variant="subtle" size="sm">
            Unlimited
          </Badge>
        )}
      </Flex>
      <Text fontSize="lg" fontWeight="600" color="gray.800" mb={isUnlimited ? 0 : 2}>
        {isUnlimited ? item.current : `${item.current} / ${item.limit}`}
      </Text>
      {!isUnlimited && item.percentage !== null && (
        <Progress.Root value={item.percentage} size="sm" colorPalette={item.progressColor} borderRadius="full">
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      )}
    </Box>
  )
})

// --- Status Banner ---

const StatusBanner: FC<{ model: LimitsPageViewModel }> = observer(({ model }) => {
  if (!model.billingEnabled) return null

  let colorPalette = 'gray'
  let title = ''
  let subtitle: string | null = null

  if (model.isFree) {
    title = 'Free Plan'
  } else if (model.isEarlyAdopter) {
    title = 'Pro Plan — Early Access'
    subtitle = 'Free while in Early Access'
    colorPalette = 'purple'
  } else if (model.isActive) {
    title = 'Pro Plan'
    if (model.currentPeriodEnd) {
      subtitle = `Renews ${new Date(model.currentPeriodEnd).toLocaleDateString()}`
    }
    colorPalette = 'green'
  } else if (model.isPastDue) {
    title = 'Payment failed'
    subtitle = 'Please update your payment method'
    colorPalette = 'orange'
  } else if (model.isCancelled) {
    title = 'Plan cancelled'
    if (model.cancelAt) {
      subtitle = `Downgrades on ${new Date(model.cancelAt).toLocaleDateString()}`
    }
    colorPalette = 'red'
  }

  return (
    <Box borderWidth="1px" borderColor={`${colorPalette}.200`} borderRadius="lg" p={4} bg={`${colorPalette}.50`}>
      <Text fontSize="sm" fontWeight="600" color={`${colorPalette}.800`}>
        {title}
      </Text>
      {subtitle && (
        <Text fontSize="xs" color={`${colorPalette}.600`} mt={1}>
          {subtitle}
        </Text>
      )}
    </Box>
  )
})

// --- Plan Card ---

const PlanCard: FC<{ plan: LimitsPagePlanFragment; model: LimitsPageViewModel }> = observer(({ plan, model }) => {
  const isCurrent = model.isPlanCurrent(plan)
  const price = model.getPlanPrice(plan)
  const earlyAccess = model.isEarlyAccessAvailable(plan)

  const handleClick = async () => {
    if (model.canUpgradeTo(plan)) {
      if (earlyAccess) {
        await model.activateEarlyAccess(plan.id)
      } else {
        await model.createCheckout(plan.id)
      }
    }
  }

  let buttonLabel = 'Current Plan'
  let buttonDisabled = true

  if (model.canUpgradeTo(plan)) {
    buttonLabel = earlyAccess ? 'Get Early Access' : 'Upgrade'
    buttonDisabled = false
  } else if (model.canDowngradeTo(plan)) {
    buttonLabel = 'Downgrade'
    buttonDisabled = false
  }

  return (
    <Box
      borderWidth="1px"
      borderColor={isCurrent ? 'gray.400' : 'gray.200'}
      borderRadius="lg"
      p={4}
      bg="white"
      flex={1}
    >
      <VStack align="start" gap={3}>
        <HStack gap={2}>
          <Text fontSize="md" fontWeight="600" color="gray.700">
            {plan.name}
          </Text>
          {isCurrent && (
            <Badge colorPalette="gray" variant="subtle" size="sm">
              Current
            </Badge>
          )}
        </HStack>
        <Text fontSize="xl" fontWeight="700" color="gray.800">
          {price}
        </Text>
        <VStack align="start" gap={1}>
          {plan.limits.projects !== null && (
            <Text fontSize="xs" color="gray.500">
              {plan.limits.projects} projects
            </Text>
          )}
          {plan.limits.seats !== null && (
            <Text fontSize="xs" color="gray.500">
              {plan.limits.seats} members
            </Text>
          )}
          {plan.limits.rowVersions !== null && (
            <Text fontSize="xs" color="gray.500">
              {formatLimitNumber(plan.limits.rowVersions)} row versions
            </Text>
          )}
          {plan.limits.storageBytes !== null && (
            <Text fontSize="xs" color="gray.500">
              {formatLimitStorage(plan.limits.storageBytes)} storage
            </Text>
          )}
        </VStack>
        <Button
          size="sm"
          variant={isCurrent ? 'outline' : 'solid'}
          width="100%"
          disabled={buttonDisabled || model.isActionLoading}
          onClick={handleClick}
        >
          {buttonLabel}
        </Button>
      </VStack>
    </Box>
  )
})

const formatLimitNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'Unlimited'
  return value.toLocaleString('en-US')
}

const formatLimitStorage = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined) return 'Unlimited'
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(0)} GB`
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(0)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

// --- Interval Toggle ---

const IntervalToggle: FC<{ model: LimitsPageViewModel }> = observer(({ model }) => {
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

// --- Payment Management ---

const PaymentSection: FC<{ model: LimitsPageViewModel }> = observer(({ model }) => {
  if (!model.hasPaymentManagement) return null

  return (
    <Box>
      <Text fontSize="sm" fontWeight="600" color="gray.600" mb="0.5rem">
        Payment
      </Text>
      <Box borderWidth="1px" borderColor="gray.200" borderRadius="lg" p={4} bg="white">
        <VStack align="stretch" gap={3}>
          {model.provider && (
            <Text fontSize="sm" color="gray.600">
              Provider: {model.provider}
            </Text>
          )}
          <DialogRoot
            open={model.isCancelDialogOpen}
            onOpenChange={(e) => (e.open ? model.openCancelDialog() : model.closeCancelDialog())}
          >
            <Button
              variant="outline"
              colorPalette="red"
              size="sm"
              alignSelf="flex-start"
              onClick={model.openCancelDialog}
            >
              Cancel Subscription
            </Button>

            <Portal>
              <DialogBackdrop />
              <DialogPositioner>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <Text>
                      Your subscription will remain active until the end of the current billing period. After that,
                      you&apos;ll be downgraded to the Free plan.
                    </Text>
                  </DialogBody>
                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button variant="outline">Keep Subscription</Button>
                    </DialogActionTrigger>
                    <Button colorPalette="red" onClick={model.cancelSubscription} disabled={model.isActionLoading}>
                      Cancel Subscription
                    </Button>
                  </DialogFooter>
                  <DialogCloseTrigger />
                </DialogContent>
              </DialogPositioner>
            </Portal>
          </DialogRoot>
        </VStack>
      </Box>
    </Box>
  )
})

// --- Main Page ---

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
              {model.billingEnabled ? 'Billing' : 'Usage'}
            </Text>
            <Text fontSize="xs" color="newGray.400">
              {model.billingEnabled ? 'Plan, usage, and payment management.' : 'Resource usage overview.'}
            </Text>
          </Box>

          <StatusBanner model={model} />

          {/* Usage Section */}
          <Box>
            <Text fontSize="sm" fontWeight="600" color="gray.600" mb={3}>
              Usage
            </Text>
            <Flex gap={3} flexWrap="wrap">
              {model.usageItems.map((item) => (
                <Box key={item.label} flex="1" minWidth="150px">
                  <UsageMetricCard item={item} />
                </Box>
              ))}
            </Flex>
          </Box>

          {/* Plans Section — only when billing enabled */}
          {model.billingEnabled && model.plans.length > 0 && (
            <Box>
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Text fontSize="sm" fontWeight="600" color="gray.600">
                  Plans
                </Text>
                <IntervalToggle model={model} />
              </Flex>
              <Flex gap={3} flexWrap="wrap">
                {model.plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} model={model} />
                ))}
              </Flex>
            </Box>
          )}

          {/* Payment Section — only when billing enabled + active/past_due */}
          {model.billingEnabled && <PaymentSection model={model} />}
        </VStack>
      </Box>
    </Page>
  )
})
