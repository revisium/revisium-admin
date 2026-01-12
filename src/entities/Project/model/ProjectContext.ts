import { makeAutoObservable, reaction, IReactionDisposer, runInAction } from 'mobx'
import { BranchLoaderData } from 'src/entities/Branch'
import { container, ObservableRequest } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'
import { IProjectContextData, PermissionService, ProjectPermissions } from 'src/shared/model/AbilityService'
import { RouterParams } from 'src/shared/model/RouterParams.ts'
import { DRAFT_TAG, HEAD_TAG } from 'src/shared/config/routes.ts'
import { ProjectLoaderData } from 'src/entities/Project'

export class ProjectContext {
  private readonly projectRequest = ObservableRequest.of(
    (organizationId: string, projectName: string) =>
      client.getProjectForLoader({ data: { organizationId, projectName } }),
    { skipResetting: true },
  )

  private readonly branchRequest = ObservableRequest.of(
    (organizationId: string, projectName: string, branchName: string) =>
      client.getBranchForLoader({ data: { organizationId, projectName, branchName } }),
    { skipResetting: true },
  )

  private disposers: IReactionDisposer[] = []
  private _hasLoadedOnce = false

  constructor(
    private readonly permissionService: PermissionService,
    private readonly projectPermissions: ProjectPermissions,
    private readonly routerParams: RouterParams,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.projectPermissions.setContextProvider(this.getContextData)
    this.setupReactions()
  }

  private getContextData = (): IProjectContextData => {
    const project = this.projectRequest.data?.project
    return {
      projectId: project?.id ?? null,
      organizationId: project?.organization?.id ?? null,
      isPublic: project?.isPublic ?? false,
      projectRoleName: project ? this.extractRoleName(project) : null,
    }
  }

  public get organizationId(): string {
    return this.data.organization.id
  }

  public get projectName(): string {
    return this.data.name
  }

  public get branchId(): string {
    return this.branch.id
  }

  public get branchName(): string {
    return this.branch.name
  }

  public get revisionIdOrTag(): string {
    return this.routerParams.revisionIdOrTag ?? DRAFT_TAG
  }

  public get revisionId(): string {
    const revisionIdOrTag = this.routerParams.revisionIdOrTag

    if (!revisionIdOrTag || revisionIdOrTag === DRAFT_TAG) {
      return this.branch.draft.id
    }

    if (revisionIdOrTag === HEAD_TAG) {
      return this.branch.head.id
    }

    return revisionIdOrTag
  }

  public get isDraftRevision(): boolean {
    const tag = this.routerParams.revisionIdOrTag
    return !tag || tag === DRAFT_TAG
  }

  public get isHeadRevision(): boolean {
    return this.routerParams.revisionIdOrTag === HEAD_TAG
  }

  public get touched(): boolean {
    return this.branch.touched
  }

  public get isProjectPublic(): boolean {
    return this.data.isPublic
  }

  public get projectRoleName(): string | null {
    const project = this.projectRequest.data?.project
    if (!project) {
      return null
    }
    return this.extractRoleName(project)
  }

  public get isInitLoading(): boolean {
    if (!this._hasLoadedOnce) {
      return true
    }

    if (!this.branchRequest.data) {
      return true
    }

    return false
  }

  public get isLoading(): boolean {
    return this.projectRequest.isLoading
  }

  public updateTouched(touched: boolean): void {
    const branch = this.branchRequest.data?.branch
    if (branch) {
      branch.touched = touched
    }
  }

  public updateProject(data: Partial<Pick<ProjectLoaderData, 'name' | 'isPublic'>>): void {
    const project = this.projectRequest.data?.project
    if (project) {
      Object.assign(project, data)
    }
  }

  public clear(): void {
    this.projectRequest.abort()
    this.branchRequest.abort()
    this.branchRequest.setDataDirectly(null)
    this._hasLoadedOnce = false
  }

  public dispose(): void {
    this.disposers.forEach((d) => d())
    this.disposers = []
    this.clear()
  }

  private setupReactions(): void {
    this.disposers.push(this.createProjectReaction())
    this.disposers.push(this.createBranchReaction())
  }

  private createProjectReaction(): IReactionDisposer {
    return reaction(
      () => ({
        organizationId: this.routerParams.organizationId,
        projectName: this.routerParams.projectName,
      }),
      (params, prevParams) => {
        if (params.organizationId && params.projectName) {
          const isProjectChanged =
            !prevParams ||
            prevParams.organizationId !== params.organizationId ||
            prevParams.projectName !== params.projectName

          if (isProjectChanged) {
            this._hasLoadedOnce = false
          }

          void this.loadProject(params.organizationId, params.projectName)
        }
      },
      { fireImmediately: true, equals: (a, b) => JSON.stringify(a) === JSON.stringify(b) },
    )
  }

  private async loadProject(organizationId: string, projectName: string): Promise<void> {
    await this.projectRequest.fetch(organizationId, projectName)
    runInAction(() => {
      this._hasLoadedOnce = true
      const project = this.projectRequest.data?.project
      if (project) {
        this.loadProjectPermissions(project)
      }
    })
  }

  private loadProjectPermissions(project: ProjectLoaderData): void {
    if (project.organization?.userOrganization?.role?.permissions) {
      const permissions = project.organization.userOrganization.role.permissions.map((p) => ({
        id: p.id,
        action: p.action,
        subject: p.subject,
        condition: (p.condition as Record<string, unknown>) ?? null,
      }))
      this.permissionService.addOrganizationPermissions(project.organization.id, permissions)
    }

    if (project.userProject?.role?.permissions) {
      const permissions = project.userProject.role.permissions.map((p) => ({
        id: p.id,
        action: p.action,
        subject: p.subject,
        condition: (p.condition as Record<string, unknown>) ?? null,
      }))
      this.permissionService.addProjectPermissions(project.id, permissions)
    }
  }

  private extractRoleName(project: ProjectLoaderData): string | null {
    if (project.userProject?.role?.name) {
      return project.userProject.role.name
    }
    if (project.organization?.userOrganization?.role?.name) {
      return project.organization.userOrganization.role.name
    }
    return null
  }

  private createBranchReaction(): IReactionDisposer {
    return reaction(
      () => ({
        project: this.projectRequest.data?.project,
        branchName: this.routerParams.branchName,
      }),
      ({ project, branchName }) => {
        if (!project) {
          return
        }

        if (!branchName) {
          if (!this.branchRequest.data) {
            this.branchRequest.setDataDirectly({ branch: project.rootBranch })
          }
          return
        }

        if (branchName === project.rootBranch.name) {
          this.branchRequest.setDataDirectly({ branch: project.rootBranch })
          return
        }

        void this.branchRequest.fetch(project.organization.id, project.name, branchName)
      },
      { fireImmediately: true },
    )
  }

  private get data(): ProjectLoaderData {
    const project = this.projectRequest.data?.project
    if (!project) {
      throw new Error('ProjectContext: project is not loaded')
    }
    return project
  }

  private get branch(): BranchLoaderData {
    const branch = this.branchRequest.data?.branch
    if (!branch) {
      throw new Error('ProjectContext: branch is not loaded')
    }
    return branch
  }
}

container.register(
  ProjectContext,
  () => {
    const permissionService = container.get(PermissionService)
    const projectPermissions = container.get(ProjectPermissions)
    const routerParams = container.get(RouterParams)
    return new ProjectContext(permissionService, projectPermissions, routerParams)
  },
  { scope: 'singleton' },
)
