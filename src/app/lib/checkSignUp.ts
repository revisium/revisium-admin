import { redirect } from 'react-router-dom'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'
import { ConfigurationService } from 'src/shared/model/ConfigurationService.ts'

export const checkSignUp = async () => {
  const authService = container.get(AuthService)
  const configurationService = container.get(ConfigurationService)

  if (authService.user || !configurationService.availableSignUp) {
    return redirect(`/`)
  }

  return true
}
