import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import { LOGIN_ROUTE, SIGN_UP_ROUTE, USERNAME_ROUTE } from 'src/shared/config/routes.ts'
import { buildRedirectParam, container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'
import { client } from 'src/shared/model/ApiService.ts'
import { ConfigurationService } from 'src/shared/model/ConfigurationService.ts'

export const checkAuth = async ({ request }: LoaderFunctionArgs) => {
  const authService = container.get(AuthService)
  const configurationService = container.get(ConfigurationService)

  if (!authService.user) {
    if (configurationService.noAuth) {
      const result = await client.login({ data: { emailOrUsername: 'admin', password: '' } })
      await authService.setToken(result.login.accessToken)
      return true
    }

    const url = new URL(request.url)
    const redirectParam = buildRedirectParam(url.pathname)
    const basePath = configurationService.availableSignUp ? `/${SIGN_UP_ROUTE}` : `/${LOGIN_ROUTE}`
    return redirect(`${basePath}${redirectParam}`)
  }

  if (!authService.user.username) {
    return redirect(`/${USERNAME_ROUTE}`)
  }

  return true
}
