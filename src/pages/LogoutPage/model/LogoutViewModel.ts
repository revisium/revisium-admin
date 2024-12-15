import { makeAutoObservable } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'
import { resetRootStore } from 'src/shared/model/RootStore.ts'

export class LogoutViewModel implements IViewModel {
  constructor(private readonly authService: AuthService) {
    makeAutoObservable(this)
  }

  public logout() {
    this.authService.logout()
    resetRootStore() // TODO (DI)
  }

  dispose(): void {}

  init(): void {}
}

container.register(
  LogoutViewModel,
  () => {
    const authService = container.get(AuthService)

    return new LogoutViewModel(authService)
  },
  { scope: 'request' },
)
