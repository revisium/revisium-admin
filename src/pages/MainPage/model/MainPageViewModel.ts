import { makeAutoObservable } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'

export class MainPageViewModel implements IViewModel {
  public isCreatingProject = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public toggleCreatingProject(): void {
    this.isCreatingProject = !this.isCreatingProject
  }

  public init(): void {}

  public dispose(): void {}
}

container.register(MainPageViewModel, () => new MainPageViewModel(), { scope: 'request' })
