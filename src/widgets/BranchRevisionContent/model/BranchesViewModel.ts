import { makeAutoObservable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { buildBranchTree } from 'src/widgets/BranchRevisionContent/lib/buildBranchTree.ts'
import { BranchTreeNode } from 'src/widgets/BranchRevisionContent/model/BranchTreeNode.ts'

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  error = 'error',
}

export class BranchesViewModel implements IViewModel {
  private state = State.loading

  private readonly findBranches = ObservableRequest.of(client.findBranches, { skipResetting: true })

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

  public get branches(): BranchTreeNode[] {
    const branches = this.findBranches.data?.branches.edges.map((edge) => edge.node) ?? []
    return buildBranchTree(branches, this.context)
  }

  public get totalCount() {
    return this.findBranches.data?.branches.totalCount ?? 0
  }

  public init() {
    void this.request()
  }

  public dispose(): void {}

  private async request(): Promise<void> {
    try {
      const result = await this.findBranches.fetch({
        data: {
          first: 100,
          organizationId: this.context.organization.id,
          projectName: this.context.project.name,
        },
      })

      runInAction(() => {
        if (result.isRight) {
          this.state = result.data.branches.totalCount ? State.list : State.empty
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
  BranchesViewModel,
  () => {
    const context = container.get(ProjectContext)

    return new BranchesViewModel(context)
  },
  { scope: 'request' },
)
