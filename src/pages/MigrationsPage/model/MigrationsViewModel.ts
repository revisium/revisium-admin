import { IReactionDisposer, makeAutoObservable, reaction, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import { ViewMode } from 'src/pages/MigrationsPage/config/viewMode.ts'
import { parsePatches } from 'src/pages/MigrationsPage/lib/parsePatches.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { PatchItemModel } from './PatchItemModel'

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  error = 'error',
}

export class MigrationsViewModel implements IViewModel {
  private state = State.loading
  private _viewMode: ViewMode = ViewMode.Table
  private revisionReaction: IReactionDisposer | null = null

  private readonly getMigrationsRequest = ObservableRequest.of(client.getMigrations, { skipResetting: true })

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

  public init(): void {
    this.load()
    this.revisionReaction = reaction(
      () => this.context.revisionId,
      () => {
        this.reset()
        this.load()
      },
    )
  }

  public dispose(): void {
    this.revisionReaction?.()
    this.revisionReaction = null
  }

  private reset(): void {
    this.state = State.loading
  }

  private load(): void {
    void this.request()
  }

  private async request(): Promise<void> {
    try {
      const result = await this.getMigrationsRequest.fetch({
        data: {
          revisionId: this.context.revisionId,
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
}

container.register(
  MigrationsViewModel,
  () => {
    const context = container.get(ProjectContext)
    return new MigrationsViewModel(context)
  },
  { scope: 'request' },
)
