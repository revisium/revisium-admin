import { IReactionDisposer, makeAutoObservable, reaction, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, isAborted } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { GetRevisionChangesQuery } from 'src/__generated__/graphql-request'
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
  private revisionReaction: IReactionDisposer | null = null

  private readonly getRevisionChangesRequest = ObservableRequest.of(client.GetRevisionChanges, {
    skipResetting: true,
  })

  constructor(
    private readonly context: ProjectContext,
    private readonly permissionContext: PermissionContext,
  ) {
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
    return this.context.isDraftRevision && this.context.branch.touched && this.permissionContext.canRevertRevision
  }

  public get showCommitButton(): boolean {
    return this.context.isDraftRevision && this.context.branch.touched && this.permissionContext.canCreateRevision
  }

  public get isDraftRevision(): boolean {
    return this.context.isDraftRevision
  }

  public get emptyStateMessage(): string {
    if (this.context.isDraftRevision) {
      return 'No changes in working copy'
    }
    return 'No changes in this revision'
  }

  public get emptyStateDescription(): string {
    if (this.context.isDraftRevision) {
      return 'Make edits to tables or rows to see changes here'
    }
    return 'This revision has no recorded changes'
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

  public init(): void {
    this.load()
    this.revisionReaction = reaction(
      () => this.context.revision.id,
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
    const result = await this.getRevisionChangesRequest.fetch({
      revisionId: this.context.revision.id,
      includeSystem: true,
    })

    if (!result.isRight) {
      if (isAborted(result)) {
        return
      }

      runInAction(() => {
        this.state = State.error
      })
      return
    }

    runInAction(() => {
      const totalChanges = result.data.revisionChanges.totalChanges
      if (totalChanges > 0) {
        this.state = State.list
      } else {
        this.state = State.empty
      }
    })
  }
}

container.register(
  ChangesPageViewModel,
  () => {
    const context = container.get(ProjectContext)
    const permissionContext = container.get(PermissionContext)
    return new ChangesPageViewModel(context, permissionContext)
  },
  { scope: 'request' },
)
