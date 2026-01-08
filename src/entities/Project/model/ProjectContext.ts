import { makeAutoObservable, reaction, IReactionDisposer, runInAction } from 'mobx'
import { BranchLoaderData } from 'src/entities/Branch'
import { RevisionLoaderData } from 'src/entities/Revision'
import { RowLoaderData } from 'src/entities/Row'
import { TableLoaderData } from 'src/entities/Table'
import { container, ObservableRequest } from 'src/shared/lib'
import { ApiService, client } from 'src/shared/model/ApiService.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { RouterService } from 'src/shared/model/RouterService.ts'
import { DRAFT_TAG, HEAD_TAG } from 'src/shared/config/routes.ts'
import { ProjectLoaderData } from 'src/entities/Project'

export interface RowContextData extends RowLoaderData {
  foreignKeysCount: number
}

type ReactionConfig<T> = {
  selector: () => T
  onValid: (params: T) => void | Promise<void>
  onInvalid: () => void
  isValid: (params: T) => boolean
}

const createConditionalReaction = <T>(config: ReactionConfig<T>): IReactionDisposer => {
  return reaction(
    config.selector,
    (params) => {
      if (config.isValid(params)) {
        config.onValid(params)
      } else {
        config.onInvalid()
      }
    },
    { fireImmediately: true },
  )
}

export class ProjectContext {
  private readonly projectRequest = ObservableRequest.of((organizationId: string, projectName: string) =>
    client.getProjectForLoader({ data: { organizationId, projectName } }),
  )

  private readonly branchRequest = ObservableRequest.of(
    (organizationId: string, projectName: string, branchName: string) =>
      client.getBranchForLoader({ data: { organizationId, projectName, branchName } }),
  )

  private readonly revisionRequest = ObservableRequest.of((revisionId: string) =>
    client.getRevisionForLoader({ data: { revisionId } }),
  )

  private readonly tableRequest = ObservableRequest.of((revisionId: string, tableId: string) =>
    client.getTableForLoader({ data: { revisionId, tableId } }),
  )

  private readonly rowRequest = ObservableRequest.of((revisionId: string, tableId: string, rowId: string) =>
    client.getRowForLoader({ data: { revisionId, tableId, rowId } }),
  )

  private readonly rowForeignKeysCountRequest = ObservableRequest.of(
    (revisionId: string, tableId: string, rowId: string) =>
      client.getRowCountForeignKeysToForLoader({ data: { revisionId, tableId, rowId } }),
  )

  private readonly allRequests = [
    this.projectRequest,
    this.branchRequest,
    this.revisionRequest,
    this.tableRequest,
    this.rowRequest,
    this.rowForeignKeysCountRequest,
  ] as const

  private disposers: IReactionDisposer[] = []

  constructor(
    private readonly apiService: ApiService,
    private readonly permissionContext: PermissionContext,
    private readonly routerService: RouterService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.setupReactions()
  }

  public get isProjectLoading(): boolean {
    return this.projectRequest.isLoading
  }

  public get isBranchLoading(): boolean {
    return this.branchRequest.isLoading
  }

  public get isRevisionLoading(): boolean {
    return this.revisionRequest.isLoading
  }

  public get isTableLoading(): boolean {
    return this.tableRequest.isLoading
  }

  public get isRowLoading(): boolean {
    return this.rowRequest.isLoading || this.rowForeignKeysCountRequest.isLoading
  }

  public get isLoading(): boolean {
    return this.isProjectLoading || this.isBranchLoading || this.isRevisionLoading
  }

  public get organization() {
    return this.project.organization
  }

  public get project(): ProjectLoaderData {
    const data = this.projectRequest.data?.project
    if (!data) {
      throw new Error('ProjectContext: project is not loaded')
    }
    return data
  }

  public get projectOrNull(): ProjectLoaderData | null {
    return this.projectRequest.data?.project ?? null
  }

  public get branch(): BranchLoaderData {
    return this.branchRequest.data?.branch ?? this.project.rootBranch
  }

  public get branchOrNull(): BranchLoaderData | null {
    return this.branchRequest.data?.branch ?? this.projectOrNull?.rootBranch ?? null
  }

  public get revision(): RevisionLoaderData {
    const data = this.revisionRequest.data?.revision
    if (data) {
      return data
    }
    return this.branch.draft
  }

  public get revisionOrNull(): RevisionLoaderData | null {
    return this.revisionRequest.data?.revision ?? this.branchOrNull?.draft ?? null
  }

  public get isDraftRevision(): boolean {
    return this.revision.id === this.branch.draft.id
  }

  public get isHeadRevision(): boolean {
    return this.revision.id === this.branch.head.id
  }

  public get table(): TableLoaderData | null {
    return this.tableRequest.data?.table ?? null
  }

  public get row(): RowContextData | null {
    const rowData = this.rowRequest.data?.row
    if (!rowData) {
      return null
    }
    return {
      ...rowData,
      foreignKeysCount: this.rowForeignKeysCountRequest.data?.row?.countForeignKeysTo ?? 0,
    }
  }

  public get projectError(): string | null {
    return this.projectRequest.errorMessage ?? null
  }

  public get branchError(): string | null {
    return this.branchRequest.errorMessage ?? null
  }

  public get tableError(): string | null {
    return this.tableRequest.errorMessage ?? null
  }

  public get rowError(): string | null {
    return this.rowRequest.errorMessage ?? null
  }

  public updateTouched(touched: boolean): void {
    const branch = this.branchRequest.data?.branch
    if (branch) {
      branch.touched = touched
    }
    const project = this.projectRequest.data?.project
    if (project) {
      project.rootBranch.touched = touched
    }
  }

  public updateProject(data: Partial<Pick<ProjectLoaderData, 'name' | 'isPublic'>>): void {
    const project = this.projectRequest.data?.project
    if (project) {
      Object.assign(project, data)
    }
  }

  public async loadProjectPermissions(organizationId: string, projectName: string): Promise<void> {
    try {
      const result = await this.apiService.client.getProject({
        data: { organizationId, projectName },
      })
      runInAction(() => {
        this.permissionContext.setProject(result.project)
      })
    } catch (error) {
      console.error('Failed to load project permissions:', error)
    }
  }

  public clear(): void {
    this.allRequests.forEach((request) => request.abort())
    this.permissionContext.clearProject()
  }

  public dispose(): void {
    this.disposers.forEach((d) => d())
    this.disposers = []
    this.clear()
  }

  private setupReactions(): void {
    this.disposers.push(
      this.createProjectReaction(),
      this.createBranchReaction(),
      this.createRevisionReaction(),
      this.createTableReaction(),
      this.createRowReaction(),
    )
  }

  private createProjectReaction(): IReactionDisposer {
    return createConditionalReaction({
      selector: () => ({
        organizationId: this.routerService.params.organizationId,
        projectName: this.routerService.params.projectName,
      }),
      isValid: ({ organizationId, projectName }) => Boolean(organizationId && projectName),
      onValid: ({ organizationId, projectName }) => this.loadProject(organizationId!, projectName!),
      onInvalid: () => this.projectRequest.abort(),
    })
  }

  private createBranchReaction(): IReactionDisposer {
    return createConditionalReaction({
      selector: () => ({
        organizationId: this.routerService.params.organizationId,
        projectName: this.routerService.params.projectName,
        branchName: this.routerService.params.branchName,
      }),
      isValid: ({ organizationId, projectName, branchName }) => Boolean(organizationId && projectName && branchName),
      onValid: ({ organizationId, projectName, branchName }) =>
        this.loadBranch(organizationId!, projectName!, branchName!),
      onInvalid: () => this.branchRequest.abort(),
    })
  }

  private createRevisionReaction(): IReactionDisposer {
    return createConditionalReaction({
      selector: () => ({
        revisionIdOrTag: this.routerService.params.revisionIdOrTag,
        branch: this.branchOrNull,
      }),
      isValid: ({ revisionIdOrTag, branch }) => Boolean(revisionIdOrTag && branch),
      onValid: ({ revisionIdOrTag, branch }) => this.loadRevision(revisionIdOrTag!, branch!),
      onInvalid: () => this.revisionRequest.abort(),
    })
  }

  private createTableReaction(): IReactionDisposer {
    return createConditionalReaction({
      selector: () => ({
        tableId: this.routerService.params.tableId,
        revision: this.revisionOrNull,
      }),
      isValid: ({ tableId, revision }) => Boolean(tableId && revision),
      onValid: ({ tableId, revision }) => this.loadTable(revision!.id, tableId!),
      onInvalid: () => {
        this.tableRequest.abort()
        this.tableRequest.setDataDirectly(null)
      },
    })
  }

  private createRowReaction(): IReactionDisposer {
    return createConditionalReaction({
      selector: () => ({
        rowId: this.routerService.params.rowId,
        tableId: this.routerService.params.tableId,
        revision: this.revisionOrNull,
      }),
      isValid: ({ rowId, tableId, revision }) => Boolean(rowId && tableId && revision),
      onValid: ({ rowId, tableId, revision }) => this.loadRow(revision!.id, tableId!, rowId!),
      onInvalid: () => {
        this.rowRequest.abort()
        this.rowForeignKeysCountRequest.abort()
        this.rowRequest.setDataDirectly(null)
        this.rowForeignKeysCountRequest.setDataDirectly(null)
      },
    })
  }

  private async loadProject(organizationId: string, projectName: string): Promise<void> {
    await this.projectRequest.fetch(organizationId, projectName)
  }

  private async loadBranch(organizationId: string, projectName: string, branchName: string): Promise<void> {
    await this.branchRequest.fetch(organizationId, projectName, branchName)
  }

  private async loadRevision(revisionIdOrTag: string, branch: BranchLoaderData): Promise<void> {
    if (revisionIdOrTag === DRAFT_TAG) {
      this.revisionRequest.setDataDirectly({ revision: branch.draft })
    } else if (revisionIdOrTag === HEAD_TAG) {
      this.revisionRequest.setDataDirectly({ revision: branch.head })
    } else {
      await this.revisionRequest.fetch(revisionIdOrTag)
    }
  }

  private async loadTable(revisionId: string, tableId: string): Promise<void> {
    await this.tableRequest.fetch(revisionId, tableId)
  }

  private async loadRow(revisionId: string, tableId: string, rowId: string): Promise<void> {
    await Promise.all([
      this.rowRequest.fetch(revisionId, tableId, rowId),
      this.rowForeignKeysCountRequest.fetch(revisionId, tableId, rowId),
    ])
  }
}

container.register(
  ProjectContext,
  () => {
    const apiService = container.get(ApiService)
    const permissionContext = container.get(PermissionContext)
    const routerService = container.get(RouterService)
    return new ProjectContext(apiService, permissionContext, routerService)
  },
  { scope: 'singleton' },
)
