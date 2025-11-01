import { makeAutoObservable, runInAction } from 'mobx'
import { SortOrder, FindRevisionFragment } from 'src/__generated__/graphql-request.ts'
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
  private cursor?: string | null = null
  private hasNextPage = false
  private readonly pageSize = 100
  private allRevisions: FindRevisionFragment[] = []

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
    return this.allRevisions.map((revision) => new RevisionTreeNode(revision, this.project))
  }

  public get totalCount() {
    return this.findRevisions.data?.branch.revisions.totalCount ?? 0
  }

  public get canLoadMore() {
    return this.hasNextPage
  }

  public init(projectPageModel: ProjectPageModel) {
    this._project = projectPageModel
    this.reset()
  }

  public dispose(): void {}

  public reset() {
    this.cursor = null
    this.hasNextPage = false
    this.allRevisions = []
    void this.request()
  }

  public tryToFetchNextPage = () => {
    if (this.hasNextPage && !this.findRevisions.isLoading) {
      void this.request()
    }
  }

  private async request(): Promise<void> {
    if (this.findRevisions.isLoading) {
      return
    }

    try {
      const result = await this.findRevisions.fetch({
        data: {
          organizationId: this.project.organization.id,
          projectName: this.project.project.name,
          branchName: this.project.branchOrThrow.name,
        },
        revisionsData: {
          first: this.pageSize,
          sort: SortOrder.Desc,
          ...(this.cursor ? { after: this.cursor } : {}),
        },
      })

      runInAction(() => {
        if (result.isRight) {
          const newRevisions = result.data.branch.revisions.edges.map((edge) => edge.node)

          if (this.cursor) {
            // Filter out duplicates by ID
            const existingIds = new Set(this.allRevisions.map((r) => r.id))
            const uniqueNewRevisions = newRevisions.filter((r) => !existingIds.has(r.id))
            this.allRevisions = [...this.allRevisions, ...uniqueNewRevisions]
          } else {
            this.allRevisions = newRevisions
          }

          this.cursor = result.data.branch.revisions.pageInfo.endCursor
          this.hasNextPage = result.data.branch.revisions.pageInfo.hasNextPage
          this.state = this.allRevisions.length ? State.list : State.empty
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
