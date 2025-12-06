import { createToaster } from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'top',
  pauseOnPageIdle: true,
  duration: 1500,
})

export const bottomToaster = createToaster({
  placement: 'bottom',
  pauseOnPageIdle: true,
  duration: 1500,
})
