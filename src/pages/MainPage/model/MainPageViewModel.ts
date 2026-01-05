import { makeAutoObservable } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'

export class MainPageViewModel implements IViewModel {
  public isCreatingProject = false

  constructor(private readonly permissionContext: PermissionContext) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get canAccessAdmin(): boolean {
    return this.permissionContext.canReadUser
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
    const permissionContext = container.get(PermissionContext)
    return new MainPageViewModel(permissionContext)
  },
  { scope: 'request' },
)
