import { makeAutoObservable, runInAction } from 'mobx'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, invariant } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
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
  private _project: ProjectPageModel | null = null

  private readonly findBranches = ObservableRequest.of(client.findBranches, { skipResetting: true })

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

  public get branches(): BranchTreeNode[] {
    const branches = this.findBranches.data?.branches.edges.map((edge) => edge.node) ?? []
    return buildBranchTree(branches, this.project)
  }

  public get totalCount() {
    return this.findBranches.data?.branches.totalCount ?? 0
  }

  public init(projectPageModel: ProjectPageModel) {
    this._project = projectPageModel
    void this.request()
  }

  public dispose(): void {}

  private async request(): Promise<void> {
    try {
      const result = await this.findBranches.fetch({
        data: {
          first: 100,
          organizationId: this.project.organization.id,
          projectName: this.project.project.name,
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

  private get project() {
    invariant(this._project, 'BranchesContentViewModel: project is not defined')

    return this._project
  }
}

container.register(
  BranchesViewModel,
  () => {
    return new BranchesViewModel()
  },
  { scope: 'request' },
)
