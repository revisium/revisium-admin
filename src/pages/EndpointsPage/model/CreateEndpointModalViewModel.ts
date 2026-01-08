import { makeAutoObservable, runInAction } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest.ts'
import { client } from 'src/shared/model/ApiService.ts'
import { EndpointType, FindBranchesQuery } from 'src/__generated__/graphql-request'

type BranchItem = FindBranchesQuery['branches']['edges'][number]['node']

interface BranchOption {
  id: string
  name: string
}

interface RevisionOption {
  id: string
  label: string
  isDraft: boolean
  isHead: boolean
}

export class CreateEndpointModalViewModel {
  private readonly createEndpointRequest = ObservableRequest.of(client.createEndpoint)
  private readonly getBranchesRequest = ObservableRequest.of(client.findBranches)
  private readonly getRevisionsRequest = ObservableRequest.of(client.findRevisions)

  private _isOpen = false
  private _allBranches: BranchItem[] = []
  private _branchId: string | null = null
  private _revisionId: string | null = null
  private _endpointType: EndpointType = EndpointType.Graphql
  private _availableRevisions: RevisionOption[] = []
  private _isCreating = false
  private _isLoadingRevisions = false

  constructor(
    private readonly context: ProjectContext,
    private readonly onCreated: () => void,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isOpen(): boolean {
    return this._isOpen
  }

  public get allBranches(): BranchOption[] {
    return this._allBranches.map((b) => ({ id: b.id, name: b.name }))
  }

  public get branchId(): string | null {
    return this._branchId
  }

  public get revisionId(): string | null {
    return this._revisionId
  }

  public get endpointType(): EndpointType {
    return this._endpointType
  }

  public get availableRevisions(): RevisionOption[] {
    return this._availableRevisions
  }

  public get isCreating(): boolean {
    return this._isCreating
  }

  public get isLoadingRevisions(): boolean {
    return this._isLoadingRevisions
  }

  public get canCreate(): boolean {
    return Boolean(this._branchId && this._revisionId && !this._isCreating)
  }

  public get selectedBranchName(): string {
    if (!this._branchId) {
      return 'Select branch'
    }
    const branch = this._allBranches.find((b) => b.id === this._branchId)
    return branch?.name ?? 'Select branch'
  }

  public get selectedRevisionLabel(): string {
    if (!this._revisionId) {
      return 'Select revision'
    }
    const revision = this._availableRevisions.find((r) => r.id === this._revisionId)
    return revision?.label ?? 'Select revision'
  }

  public async open(): Promise<void> {
    this._isOpen = true
    this._branchId = null
    this._revisionId = null
    this._endpointType = EndpointType.Graphql
    this._availableRevisions = []
    await this.loadBranches()
  }

  public close(): void {
    this._isOpen = false
  }

  public async setBranchId(branchId: string | null): Promise<void> {
    this._branchId = branchId
    this._revisionId = null
    this._availableRevisions = []
    if (branchId) {
      await this.loadRevisions(branchId)
    }
  }

  public setRevisionId(revisionId: string | null): void {
    this._revisionId = revisionId
  }

  public setEndpointType(type: EndpointType): void {
    this._endpointType = type
  }

  public async create(): Promise<void> {
    if (!this._revisionId || this._isCreating) {
      return
    }

    this._isCreating = true
    try {
      const result = await this.createEndpointRequest.fetch({
        data: {
          revisionId: this._revisionId,
          type: this._endpointType,
        },
      })

      if (result.isRight) {
        this.close()
        this.onCreated()
      }
    } catch (e) {
      console.error(e)
    } finally {
      runInAction(() => {
        this._isCreating = false
      })
    }
  }

  private get organizationId(): string {
    return this.context.organizationId
  }

  private get projectName(): string {
    return this.context.projectName
  }

  private async loadBranches(): Promise<void> {
    try {
      const result = await this.getBranchesRequest.fetch({
        data: {
          organizationId: this.organizationId,
          projectName: this.projectName,
          first: 100,
        },
      })
      runInAction(() => {
        if (result.isRight) {
          this._allBranches = result.data.branches.edges.map((edge) => edge.node)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }

  private async loadRevisions(branchId: string): Promise<void> {
    this._isLoadingRevisions = true
    const branch = this._allBranches.find((b) => b.id === branchId)
    if (!branch) {
      this._isLoadingRevisions = false
      return
    }

    try {
      const result = await this.getRevisionsRequest.fetch({
        data: {
          organizationId: this.organizationId,
          projectName: this.projectName,
          branchName: branch.name,
        },
        revisionsData: { first: 50 },
      })

      runInAction(() => {
        if (result.isRight && result.data.branch) {
          this._availableRevisions = result.data.branch.revisions.edges
            .map((edge) => {
              const rev = edge.node
              let label = rev.id.slice(0, 8)
              if (rev.isDraft) {
                label = 'draft'
              } else if (rev.isHead) {
                label = 'head'
              }
              return {
                id: rev.id,
                label,
                isDraft: rev.isDraft,
                isHead: rev.isHead,
              }
            })
            .reverse()
        }
      })
    } catch (e) {
      console.error(e)
    } finally {
      runInAction(() => {
        this._isLoadingRevisions = false
      })
    }
  }
}
