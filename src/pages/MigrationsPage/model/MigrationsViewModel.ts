import { makeAutoObservable, runInAction } from 'mobx'
import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import { ViewMode } from 'src/pages/MigrationsPage/config/viewMode.ts'
import { parsePatches } from 'src/pages/MigrationsPage/lib/parsePatches.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, invariant } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { PatchItemModel } from './PatchItemModel'

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  error = 'error',
}

export class MigrationsViewModel implements IViewModel {
  private state = State.loading
  private _project: ProjectPageModel | null = null
  private _viewMode: ViewMode = ViewMode.Table

  private readonly getMigrationsRequest = ObservableRequest.of(client.getMigrations, { skipResetting: true })

  constructor() {
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

  public get data(): MigrationData[] {
    return (this.getMigrationsRequest.data?.revision?.migrations as MigrationData[]) ?? []
  }

  public get items(): PatchItemModel[] {
    return parsePatches(this.data).reverse()
  }

  public get viewMode(): ViewMode {
    return this._viewMode
  }

  public get isTableMode(): boolean {
    return this._viewMode === ViewMode.Table
  }

  public setViewMode(mode: ViewMode): void {
    this._viewMode = mode
  }

  public get isEmpty(): boolean {
    return this.items.length === 0
  }

  public get totalCount(): number {
    return this.items.length
  }

  public init(projectPageModel: ProjectPageModel) {
    this._project = projectPageModel
    void this.request()
  }

  public dispose(): void {}

  private async request(): Promise<void> {
    try {
      const result = await this.getMigrationsRequest.fetch({
        data: {
          revisionId: this.project.revisionOrThrow.id,
        },
      })

      runInAction(() => {
        if (result.isRight) {
          const migrations = result.data.revision.migrations as MigrationData[]
          if (migrations.length) {
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
    invariant(this._project, 'MigrationsViewModel: project is not defined')

    return this._project
  }
}

container.register(
  MigrationsViewModel,
  () => {
    return new MigrationsViewModel()
  },
  { scope: 'request' },
)
