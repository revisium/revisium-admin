import { Box, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LimitsPageViewModel } from 'src/pages/OrganizationLimitsPage/model/LimitsPageViewModel.ts'

interface StatusBannerProps {
  model: LimitsPageViewModel
}

export const StatusBanner: FC<StatusBannerProps> = observer(({ model }) => {
  if (!model.billingEnabled) return null

  const color = model.statusColor

  return (
    <Box borderWidth="1px" borderColor={`${color}.200`} borderRadius="lg" p={4} bg={`${color}.50`}>
      <Text fontSize="sm" fontWeight="600" color={`${color}.800`}>
        {model.statusTitle}
      </Text>
      {model.statusSubtitle && (
        <Text fontSize="xs" color={`${color}.600`} mt={1}>
          {model.statusSubtitle}
        </Text>
      )}
    </Box>
  )
})
