import { createToaster } from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'top',
  pauseOnPageIdle: true,
})

export const bottomToaster = createToaster({
  placement: 'bottom',
  pauseOnPageIdle: true,
})
