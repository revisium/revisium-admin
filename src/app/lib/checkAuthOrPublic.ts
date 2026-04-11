import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import { USERNAME_ROUTE } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'
import { client } from 'src/shared/model/ApiService.ts'
import { ConfigurationService } from 'src/shared/model/ConfigurationService.ts'

export const checkAuthOrPublic = async (_args: LoaderFunctionArgs) => {
  const authService = container.get(AuthService)
  const configurationService = container.get(ConfigurationService)

  if (!authService.user) {
    if (configurationService.noAuth) {
      const result = await client.login({ data: { emailOrUsername: 'admin', password: '' } })
      authService.setBearerToken(result.login.accessToken)
      await authService.afterLogin()
      return true
    }

    // Allow unauthenticated users through — project load will determine access
    return true
  }

  if (!authService.user.username) {
    return redirect(`/${USERNAME_ROUTE}`)
  }

  return true
}
