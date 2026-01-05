import { makeAutoObservable } from 'mobx'
import { IViewModel } from 'src/shared/config/types'
import { container } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest'

export class AdminDashboardViewModel implements IViewModel {
  private readonly usersRequest = ObservableRequest.of(client.AdminDashboardStats)

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoadingUsers(): boolean {
    return this.usersRequest.isLoading
  }

  public get isLoadingProjects(): boolean {
    return false
  }

  public get usersCount(): number | null {
    return this.usersRequest.data?.searchUsers.totalCount ?? null
  }

  public get projectsCount(): number | null {
    return null
  }

  public init(): void {
    void this.usersRequest.fetch({ first: 1 })
  }

  public dispose(): void {
    this.usersRequest.abort()
  }
}

container.register(AdminDashboardViewModel, () => new AdminDashboardViewModel(), { scope: 'request' })
