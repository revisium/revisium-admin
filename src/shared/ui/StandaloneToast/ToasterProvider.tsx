import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { bottomToaster, toaster } from 'src/shared/ui/StandaloneToast/toaster.tsx'

interface ToastContentProps {
  type?: string
  title?: ReactNode
  description?: ReactNode
  action?: { label: string }
  closable?: boolean
}

const ToastContent = (toast: ToastContentProps) => (
  <Toast.Root width={{ md: 'sm' }}>
    {toast.type === 'loading' ? <Spinner size="sm" color="blue.solid" /> : <Toast.Indicator />}
    <Stack gap="1" flex="1" maxWidth="100%">
      {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
      {toast.description && <Toast.Description color="gray.500">{toast.description}</Toast.Description>}
    </Stack>
    {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
    {toast.closable && <Toast.CloseTrigger />}
  </Toast.Root>
)

export const ToasterProvider = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => <ToastContent {...toast} />}
      </ChakraToaster>
      <ChakraToaster toaster={bottomToaster} insetInline={{ mdDown: '4' }}>
        {(toast) => <ToastContent {...toast} />}
      </ChakraToaster>
    </Portal>
  )
}
