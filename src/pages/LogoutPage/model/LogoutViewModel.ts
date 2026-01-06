import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model'

export class LogoutViewModel implements IViewModel {
  constructor(
    private readonly authService: AuthService,
    private readonly projectContext: ProjectContext,
  ) {
    makeAutoObservable(this)
  }

  public logout() {
    this.authService.logout()
    this.projectContext.clear()
  }

  dispose(): void {}

  init(): void {}
}

container.register(
  LogoutViewModel,
  () => {
    const authService = container.get(AuthService)
    const projectContext = container.get(ProjectContext)

    return new LogoutViewModel(authService, projectContext)
  },
  { scope: 'request' },
)
