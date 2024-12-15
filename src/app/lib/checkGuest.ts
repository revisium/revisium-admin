import { redirect } from 'react-router-dom'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'

export const checkGuest = async () => {
  const authService = container.get(AuthService)

  if (authService.user) {
    return redirect(`/`)
  }

  return true
}
