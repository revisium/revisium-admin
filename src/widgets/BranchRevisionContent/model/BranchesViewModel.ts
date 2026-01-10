import { makeAutoObservable, runInAction } from 'mobx'
import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, isAborted } from 'src/shared/lib'
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

  constructor(
    private readonly context: ProjectContext,
    private readonly linkMaker: LinkMaker,
  ) {
    makeAutoObservable(this)
  }

  public get branchesLink(): string {
    return this.linkMaker.makeBranchesLink()
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
    const result = await this.findBranches.fetch({
      data: {
        first: 100,
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
      },
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
      this.state = result.data.branches.totalCount ? State.list : State.empty
    })
  }
}

container.register(
  BranchesViewModel,
  () => {
    const context = container.get(ProjectContext)
    const linkMaker = container.get(LinkMaker)

    return new BranchesViewModel(context, linkMaker)
  },
  { scope: 'request' },
)
