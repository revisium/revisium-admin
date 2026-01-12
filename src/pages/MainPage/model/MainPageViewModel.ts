import { makeAutoObservable } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { SystemPermissions } from 'src/shared/model/AbilityService'

export class MainPageViewModel implements IViewModel {
  public isCreatingProject = false

  constructor(private readonly systemPermissions: SystemPermissions) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get canAccessAdmin(): boolean {
    return this.systemPermissions.canReadUser
  }

  public toggleCreatingProject(): void {
    this.isCreatingProject = !this.isCreatingProject
  }

  public init(): void {}

  public dispose(): void {}
}

container.register(
  MainPageViewModel,
  () => {
    const systemPermissions = container.get(SystemPermissions)
    return new MainPageViewModel(systemPermissions)
  },
  { scope: 'request' },
)
