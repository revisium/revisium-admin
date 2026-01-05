import { makeAutoObservable } from 'mobx'
import { generatePath } from 'react-router-dom'
import { AdminUserItemFragment } from 'src/__generated__/graphql-request'
import { ADMIN_ROUTE, ADMIN_USERS_ROUTE } from 'src/shared/config/routes'

export class AdminUserItemViewModel {
  constructor(private readonly data: AdminUserItemFragment) {
    makeAutoObservable(this)
  }

  public get id(): string {
    return this.data.id
  }

  public get username(): string | null {
    return this.data.username ?? null
  }

  public get email(): string | null {
    return this.data.email ?? null
  }

  public get roleName(): string | null {
    return this.data.role?.name ?? null
  }

  public get link(): string {
    return generatePath(`/${ADMIN_ROUTE}/${ADMIN_USERS_ROUTE}/:userId`, { userId: this.data.id })
  }
}
