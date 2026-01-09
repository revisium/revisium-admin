import { makeAutoObservable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { container, isAborted, ObservableRequest } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'
import { EndpointType, RevisionWithEndpointsFragment, SortOrder } from 'src/__generated__/graphql-request'
import { BranchWithRevisions, EndpointsDataSource } from '../api/EndpointsDataSource.ts'

interface RevisionOption {
  id: string
  label: string
  hasGraphql: boolean
  hasRestApi: boolean
}

export type CreateEndpointDialogViewModelFactoryFn = (
  branches: BranchWithRevisions[],
  onCreated: () => void,
) => CreateEndpointDialogViewModel

export class CreateEndpointDialogViewModelFactory {
  constructor(public readonly create: CreateEndpointDialogViewModelFactoryFn) {}
}

export class CreateEndpointDialogViewModel {
  private _isOpen = false
  private _isCreating = false
  private _selectedBranchId: string | null = null
  private _selectedRevisionId: string | null = null
  private _selectedType: EndpointType = EndpointType.Graphql
  private _revisions: RevisionWithEndpointsFragment[] = []
  private _isLoadingRevisions = false

  private readonly getBranchRevisions = ObservableRequest.of(client.getBranchRevisions, { skipResetting: true })

  constructor(
    private readonly context: ProjectContext,
    private readonly dataSource: EndpointsDataSource,
    private readonly branches: BranchWithRevisions[],
    private readonly onCreated: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get isCreating(): boolean {
    return this._isCreating
  }

  public get isLoadingRevisions(): boolean {
    return this._isLoadingRevisions
  }

  public get branchOptions(): { id: string; name: string; isRoot: boolean }[] {
    return this.branches.map((b) => ({
      id: b.id,
      name: b.name,
      isRoot: b.isRoot,
    }))
  }

  public get selectedBranchId(): string | null {
    return this._selectedBranchId
  }

  public get selectedRevisionId(): string | null {
    return this._selectedRevisionId
  }

  public get selectedType(): EndpointType {
    return this._selectedType
  }

  public get revisionOptions(): RevisionOption[] {
    return this._revisions
      .filter((r) => !r.isDraft && !r.isHead)
      .map((r) => ({
        id: r.id,
        label: this.getRevisionLabel(r),
        hasGraphql: r.endpoints.some((e) => e.type === EndpointType.Graphql),
        hasRestApi: r.endpoints.some((e) => e.type === EndpointType.RestApi),
      }))
  }

  public get hasNoCustomRevisions(): boolean {
    return this._selectedBranchId !== null && !this._isLoadingRevisions && this.revisionOptions.length === 0
  }

  public get canCreate(): boolean {
    if (!this._selectedRevisionId || this._isCreating) {
      return false
    }

    const revision = this.revisionOptions.find((r) => r.id === this._selectedRevisionId)
    if (!revision) {
      return false
    }

    if (this._selectedType === EndpointType.Graphql) {
      return !revision.hasGraphql
    }
    return !revision.hasRestApi
  }

  public get selectedRevisionHasEndpoint(): boolean {
    const revision = this.revisionOptions.find((r) => r.id === this._selectedRevisionId)
    if (!revision) {
      return false
    }

    if (this._selectedType === EndpointType.Graphql) {
      return revision.hasGraphql
    }
    return revision.hasRestApi
  }

  public open(): void {
    this._isOpen = true
    this._selectedBranchId = null
    this._selectedRevisionId = null
    this._selectedType = EndpointType.Graphql
    this._revisions = []
  }

  public close(): void {
    this._isOpen = false
    this._selectedBranchId = null
    this._selectedRevisionId = null
    this._revisions = []
  }

  public selectBranch(branchId: string): void {
    if (this._selectedBranchId === branchId) {
      return
    }

    this._selectedBranchId = branchId
    this._selectedRevisionId = null
    this._revisions = []

    const branch = this.branches.find((b) => b.id === branchId)
    if (branch) {
      void this.loadRevisions(branch.name)
    }
  }

  public selectRevision(revisionId: string): void {
    this._selectedRevisionId = revisionId
  }

  public selectType(type: EndpointType): void {
    this._selectedType = type
  }

  public async create(): Promise<void> {
    if (!this.canCreate || !this._selectedRevisionId) {
      return
    }

    this._isCreating = true

    try {
      const endpoint = await this.dataSource.createEndpoint({
        revisionId: this._selectedRevisionId,
        type: this._selectedType,
      })

      runInAction(() => {
        if (endpoint) {
          this.onCreated()
          this.close()
        }
      })
    } finally {
      runInAction(() => {
        this._isCreating = false
      })
    }
  }

  private async loadRevisions(branchName: string): Promise<void> {
    this._isLoadingRevisions = true

    const result = await this.getBranchRevisions.fetch({
      data: {
        organizationId: this.context.organizationId,
        projectName: this.context.projectName,
        branchName,
      },
      revisionsData: {
        first: 100,
        sort: SortOrder.Desc,
      },
    })

    if (!result.isRight) {
      if (isAborted(result)) {
        return
      }
      runInAction(() => {
        this._isLoadingRevisions = false
      })
      return
    }

    runInAction(() => {
      this._revisions = result.data.branch.revisions.edges.map((edge) => edge.node)
      this._isLoadingRevisions = false
    })
  }

  private getRevisionLabel(revision: RevisionWithEndpointsFragment): string {
    if (revision.comment) {
      return revision.comment
    }
    return revision.id.substring(0, 8)
  }
}

container.register(
  CreateEndpointDialogViewModelFactory,
  () => {
    const context = container.get(ProjectContext)
    const dataSource = container.get(EndpointsDataSource)

    return new CreateEndpointDialogViewModelFactory(
      (branches, onCreated) => new CreateEndpointDialogViewModel(context, dataSource, branches, onCreated),
    )
  },
  { scope: 'request' },
)
