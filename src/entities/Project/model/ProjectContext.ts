import { makeAutoObservable, runInAction } from 'mobx'
import { GetProjectQuery } from 'src/__generated__/graphql-request.ts'
import { BranchLoaderData } from 'src/entities/Branch'
import { RevisionLoaderData } from 'src/entities/Revision'
import { RowLoaderData } from 'src/entities/Row'
import { TableLoaderData } from 'src/entities/Table'
import { container, invariant } from 'src/shared/lib'
import { ApiService } from 'src/shared/model/ApiService.ts'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { ProjectLoaderData } from '../api/ProjectDataSource.ts'

export type ProjectData = GetProjectQuery['project']

export class ProjectContext {
  private _project: ProjectLoaderData | null = null
  private _branch: BranchLoaderData | null = null
  private _revision: RevisionLoaderData | null = null
  private _table: TableLoaderData | null = null
  private _row: RowLoaderData | null = null

  constructor(
    private readonly apiService: ApiService,
    private readonly permissionContext: PermissionContext,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get organization() {
    return this.project.organization
  }

  public get project() {
    invariant(this._project, 'ProjectContext: project is not defined')

    return this._project
  }

  public get branch() {
    return this._branch ?? this.project.rootBranch
  }

  public get revision() {
    return this._revision ?? this.branch.draft
  }

  public get isDraftRevision() {
    return this.revision.id === this.branch.draft.id
  }

  public get isHeadRevision() {
    return this.revision.id === this.branch.head.id
  }

  public get table() {
    return this._table
  }

  public get row() {
    return this._row
  }

  public setProject(project: ProjectLoaderData | null): void {
    this._project = project
  }

  public setBranch(branch: BranchLoaderData | null): void {
    this._branch = branch
  }

  public setRevision(revision: RevisionLoaderData | null): void {
    this._revision = revision
  }

  public setTable(table: TableLoaderData | null): void {
    this._table = table
  }

  public setRow(row: RowLoaderData | null): void {
    this._row = row
  }

  public updateTouched(touched: boolean): void {
    if (this._branch) {
      this._branch = { ...this._branch, touched }
    }
    if (this._project) {
      this._project = {
        ...this._project,
        rootBranch: { ...this._project.rootBranch, touched },
      }
    }
  }

  public updateProject(data: Partial<Pick<ProjectLoaderData, 'name' | 'isPublic'>>): void {
    if (this._project) {
      this._project = { ...this._project, ...data }
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
    this._project = null
    this._branch = null
    this._revision = null
    this._table = null
    this._row = null
    this.permissionContext.clearProject()
  }
}

container.register(
  ProjectContext,
  () => {
    const apiService = container.get(ApiService)
    const permissionContext = container.get(PermissionContext)
    return new ProjectContext(apiService, permissionContext)
  },
  { scope: 'singleton' },
)
