import { makeAutoObservable } from 'mobx'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'

export class MenuListModel {
  constructor(private readonly projectPageModel: ProjectPageModel) {
    makeAutoObservable(this)
  }

  public get projectName(): string {
    return this.project.name
  }

  public init() {}

  public dispose() {}

  private get project() {
    return this.projectPageModel.project
  }
}
