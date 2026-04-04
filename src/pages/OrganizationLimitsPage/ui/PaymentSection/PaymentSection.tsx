import { Box, Button, Portal, Text, VStack } from '@chakra-ui/react'
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
import { LimitsPageViewModel } from 'src/pages/OrganizationLimitsPage/model/LimitsPageViewModel.ts'

interface PaymentSectionProps {
  model: LimitsPageViewModel
}

export const PaymentSection: FC<PaymentSectionProps> = observer(({ model }) => {
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
