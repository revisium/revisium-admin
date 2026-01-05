import { redirect } from 'react-router-dom'
import { ROOT_ROUTE } from 'src/shared/config/routes'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'

export const checkAdmin = async () => {
  const permissionContext = container.get(PermissionContext)

  if (!permissionContext.canReadUser) {
    return redirect(ROOT_ROUTE)
  }

  return true
}
