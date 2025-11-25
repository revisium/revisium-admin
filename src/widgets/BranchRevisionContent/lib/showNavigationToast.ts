import { bottomToaster } from 'src/shared/ui'

const NAVIGATION_TOAST_ID = 'navigation-toast'

interface NavigationToastOptions {
  path: string
  isReadonly: boolean
}

export const showNavigationToast = ({ path, isReadonly }: NavigationToastOptions): void => {
  const description = isReadonly ? 'read-only' : 'working copy'
  const toastOptions = {
    id: NAVIGATION_TOAST_ID,
    title: `Version: ${path}`,
    description,
    duration: 2000,
  }

  const isVisible = bottomToaster.isVisible(NAVIGATION_TOAST_ID)

  if (isVisible) {
    bottomToaster.update(NAVIGATION_TOAST_ID, toastOptions)
  } else {
    bottomToaster.info(toastOptions)
  }
}
