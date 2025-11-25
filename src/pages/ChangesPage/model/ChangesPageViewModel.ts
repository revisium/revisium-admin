import { makeAutoObservable, runInAction } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, invariant } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { GetRevisionChangesQuery } from 'src/__generated__/graphql-request'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { CreateRevisionCommand } from 'src/shared/model/BackendStore/handlers/mutations/CreateRevisionCommand.ts'
import { RevertChangesCommand } from 'src/shared/model/BackendStore/handlers/mutations/RevertChangesCommand.ts'
import { rootStore } from 'src/shared/model/RootStore.ts'

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  error = 'error',
}

export class ChangesPageViewModel implements IViewModel {
  private state = State.loading
  private _project: ProjectPageModel | null = null

  private readonly getRevisionChangesRequest = ObservableRequest.of(client.GetRevisionChanges, {
    skipResetting: true,
  })

  constructor(private readonly context: ProjectContext) {
    makeAutoObservable(this)
  }

  public get showLoading() {
    return this.state === State.loading
  }

  public get showError() {
    return this.state === State.error
  }

  public get showEmpty() {
    return this.state === State.empty
  }

  public get showList() {
    return this.state === State.list
  }

  public get revisionChanges(): GetRevisionChangesQuery['revisionChanges'] | null {
    return this.getRevisionChangesRequest.data?.revisionChanges ?? null
  }

  public get totalChanges(): number {
    return this.revisionChanges?.totalChanges ?? 0
  }

  public get tablesSummary() {
    return this.revisionChanges?.tablesSummary
  }

  public get rowsSummary() {
    return this.revisionChanges?.rowsSummary
  }

  public get showRevertButton(): boolean {
    return this.context.isDraftRevision && this.context.branch.touched
  }

  public get showCommitButton(): boolean {
    return this.context.isDraftRevision && this.context.branch.touched
  }

  public async handleRevertChanges(): Promise<void> {
    try {
      const command = new RevertChangesCommand(this.context)
      await command.execute()
    } catch (e) {
      console.error(e)
    }
  }

  public async handleCommitChanges(comment: string): Promise<void> {
    try {
      const command = new CreateRevisionCommand(rootStore, this.context, comment)
      await command.execute()
    } catch (e) {
      console.error(e)
    }
  }

  public init(projectPageModel: ProjectPageModel) {
    this._project = projectPageModel
    void this.request()
  }

  public dispose(): void {}

  private async request(): Promise<void> {
    try {
      const result = await this.getRevisionChangesRequest.fetch({
        revisionId: this.project.revisionOrThrow.id,
        includeSystem: false,
      })

      runInAction(() => {
        if (result.isRight) {
          const totalChanges = result.data.revisionChanges.totalChanges
          if (totalChanges > 0) {
            this.state = State.list
          } else {
            this.state = State.empty
          }
        } else {
          this.state = State.error
        }
      })
    } catch (e) {
      runInAction(() => {
        this.state = State.error
      })
      console.error(e)
    }
  }

  private get project() {
    invariant(this._project, 'ChangesPageViewModel: project is not defined')

    return this._project
  }
}

container.register(
  ChangesPageViewModel,
  () => {
    const context = container.get(ProjectContext)
    return new ChangesPageViewModel(context)
  },
  { scope: 'request' },
)
