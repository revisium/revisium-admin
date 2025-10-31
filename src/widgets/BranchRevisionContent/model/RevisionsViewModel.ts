import { makeAutoObservable, runInAction } from 'mobx'
import { SortOrder } from 'src/__generated__/graphql-request.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, invariant } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { RevisionTreeNode } from 'src/widgets/BranchRevisionContent/model/RevisionTreeNode.ts'

enum State {
  loading = 'loading',
  empty = 'empty',
  list = 'list',
  error = 'error',
}

export class RevisionsViewModel implements IViewModel {
  private state = State.loading
  private _project: ProjectPageModel | null = null

  private readonly findRevisions = ObservableRequest.of(client.findRevisions, { skipResetting: true })

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

  public get revisions(): RevisionTreeNode[] {
    const revisions = this.findRevisions.data?.branch.revisions.edges.map((edge) => edge.node) ?? []
    return revisions.map((revision) => new RevisionTreeNode(revision, this.project))
  }

  public get totalCount() {
    return this.findRevisions.data?.branch.revisions.totalCount ?? 0
  }

  public init(projectPageModel: ProjectPageModel) {
    this._project = projectPageModel
    void this.request()
  }

  public dispose(): void {}

  private async request(): Promise<void> {
    try {
      const result = await this.findRevisions.fetch({
        data: {
          organizationId: this.project.organization.id,
          projectName: this.project.project.name,
          branchName: this.project.branchOrThrow.name,
        },
        revisionsData: {
          first: 50,
          sort: SortOrder.Desc,
        },
      })

      runInAction(() => {
        if (result.isRight) {
          this.state = result.data.branch.revisions.totalCount ? State.list : State.empty
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
    invariant(this._project, 'RevisionsViewModel: project is not defined')
    return this._project
  }
}

container.register(
  RevisionsViewModel,
  () => {
    return new RevisionsViewModel()
  },
  { scope: 'request' },
)
