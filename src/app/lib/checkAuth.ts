import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import { LOGIN_ROUTE, SIGN_UP_ROUTE, USERNAME_ROUTE } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'
import { ConfigurationService } from 'src/shared/model/ConfigurationService.ts'

export const checkAuth = async ({ request }: LoaderFunctionArgs) => {
  const authService = container.get(AuthService)
  const configurationService = container.get(ConfigurationService)

  if (!authService.user) {
    const url = new URL(request.url)
    const currentPath = url.pathname
    const redirectParam = currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''
    const basePath = configurationService.availableSignUp ? `/${SIGN_UP_ROUTE}` : `/${LOGIN_ROUTE}`
    return redirect(`${basePath}${redirectParam}`)
  }

  if (!authService.user.username) {
    return redirect(`/${USERNAME_ROUTE}`)
  }

  return true
}
