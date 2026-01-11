import { redirect } from 'react-router-dom'
import { ROOT_ROUTE } from 'src/shared/config/routes'
import { container } from 'src/shared/lib'
import { SystemPermissions } from 'src/shared/model/AbilityService'

export const checkAdmin = async () => {
  const systemPermissions = container.get(SystemPermissions)

  if (!systemPermissions.canReadUser) {
    return redirect(ROOT_ROUTE)
  }

  return true
}
