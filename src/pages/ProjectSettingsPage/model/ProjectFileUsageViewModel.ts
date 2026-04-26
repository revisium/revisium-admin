import { ClientError } from 'graphql-request'
import { IReactionDisposer, makeAutoObservable, reaction, runInAction } from 'mobx'
import { ProjectFileUsageReportModel, RestoreProjectFileBytesResultModel } from 'src/__generated__/graphql-request.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, isAborted, ObservableRequest } from 'src/shared/lib'
import { PermissionService, ProjectPermissions } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService.ts'
import { toaster } from 'src/shared/ui'
import {
  formatByteValue,
  formatExactBytes,
  formatHumanReadableBytes,
  parseByteString,
} from '../lib/fileUsageFormatters.ts'

function getGraphQLErrorMessage(error: unknown): string {
  if (error instanceof ClientError) {
    const graphQLError = error.response.errors?.[0]
    if (graphQLError?.message) {
      return graphQLError.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Request failed'
}

export class ProjectFileUsageViewModel implements IViewModel {
  private readonly validateRequest = ObservableRequest.of((projectId: string) =>
    client.adminValidateProjectFileBytes({ data: { projectId } }),
  )
  private readonly previewRestoreRequest = ObservableRequest.of((projectId: string) =>
    client.adminRestoreProjectFileBytes({ data: { projectId, dryRun: true } }),
  )
  private readonly applyRestoreRequest = ObservableRequest.of((projectId: string) =>
    client.adminRestoreProjectFileBytes({ data: { projectId, dryRun: false } }),
  )

  private readonly disposer: IReactionDisposer

  private _restoreDialogOpen = false
  private _restoreError: string | null = null

  constructor(
    private readonly projectPermissions: ProjectPermissions,
    private readonly permissionService: PermissionService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.disposer = reaction(
      () => this.projectPermissions.projectId,
      (projectId) => {
        runInAction(() => {
          this._restoreDialogOpen = false
          this._restoreError = null
        })

        this.previewRestoreRequest.abort()
        this.applyRestoreRequest.abort()

        if (!projectId) {
          return
        }

        void this.validate()
      },
      { fireImmediately: true },
    )
  }

  public get report(): ProjectFileUsageReportModel | null {
    return this.validateRequest.data?.adminValidateProjectFileBytes ?? null
  }

  public get preview(): RestoreProjectFileBytesResultModel | null {
    return this.previewRestoreRequest.data?.adminRestoreProjectFileBytes ?? null
  }

  public get isLoading(): boolean {
    return this.validateRequest.isLoading && !this.validateRequest.isLoaded
  }

  public get isRefreshing(): boolean {
    return this.validateRequest.isLoading && this.validateRequest.isLoaded
  }

  public get isPreviewLoading(): boolean {
    return this.previewRestoreRequest.isLoading
  }

  public get isApplyingRestore(): boolean {
    return this.applyRestoreRequest.isLoading
  }

  public get validateError(): string | null {
    return this.validateRequest.error ? getGraphQLErrorMessage(this.validateRequest.error) : null
  }

  public get restoreError(): string | null {
    return this._restoreError
  }

  public get hasManagePermission(): boolean {
    const projectId = this.projectPermissions.projectId
    const organizationId = this.projectPermissions.organizationId

    if (!projectId) {
      return false
    }

    const context: Record<string, string> = { projectId }

    if (organizationId) {
      context.organizationId = organizationId
    }

    return this.permissionService.can('manage', 'FileUsage', context)
  }

  public get currentBytes(): string {
    return this.report?.currentFileBytes ?? '0'
  }

  public get expectedBytes(): string {
    return this.report?.expectedFileBytes ?? '0'
  }

  public get drift(): string {
    return this.report?.drift ?? '0'
  }

  public get fileBlobCount(): number {
    return this.report?.fileBlobCount ?? 0
  }

  public get referenceCount(): number {
    return this.report?.referenceCount ?? 0
  }

  public get hasDrift(): boolean {
    return parseByteString(this.drift) !== 0n
  }

  public get canRestore(): boolean {
    return this.hasDrift && this.hasManagePermission
  }

  public get restoreDialogOpen(): boolean {
    return this._restoreDialogOpen
  }

  public get currentBytesLabel(): string {
    return formatByteValue(this.currentBytes)
  }

  public get expectedBytesLabel(): string {
    return formatByteValue(this.expectedBytes)
  }

  public get driftLabel(): string {
    const drift = parseByteString(this.drift)

    if (drift === 0n) {
      return '0 B (0 bytes)'
    }

    return `${formatHumanReadableBytes(this.drift)} (${formatExactBytes(this.drift)})`
  }

  public get driftColor(): string {
    const drift = parseByteString(this.drift)

    if (drift === 0n) {
      return 'green.600'
    }

    return drift > 0n ? 'orange.600' : 'red.600'
  }

  public get previewPreviousBytesLabel(): string {
    return formatByteValue(this.preview?.previousFileBytes ?? '0')
  }

  public get previewNextBytesLabel(): string {
    return formatByteValue(this.preview?.nextFileBytes ?? '0')
  }

  public get previewDriftLabel(): string {
    if (!this.preview) {
      return '0 B (0 bytes)'
    }

    const drift = parseByteString(this.preview.drift)

    if (drift === 0n) {
      return '0 B (0 bytes)'
    }

    return `${formatHumanReadableBytes(this.preview.drift)} (${formatExactBytes(this.preview.drift)})`
  }

  public openRestoreDialog(): void {
    this._restoreDialogOpen = true
  }

  public closeRestoreDialog(): void {
    this._restoreDialogOpen = false
    this._restoreError = null
    this.previewRestoreRequest.abort()
    this.applyRestoreRequest.abort()
  }

  public async validate(): Promise<void> {
    const projectId = this.projectPermissions.projectId

    if (!projectId || !this.hasManagePermission) {
      return
    }

    const result = await this.validateRequest.fetch(projectId)

    if (!result.isRight && isAborted(result)) {
      return
    }
  }

  public async previewRestore(): Promise<void> {
    const projectId = this.projectPermissions.projectId

    if (!projectId || !this.canRestore) {
      return
    }

    runInAction(() => {
      this._restoreDialogOpen = true
      this._restoreError = null
    })

    const result = await this.previewRestoreRequest.fetch(projectId)

    if (!result.isRight) {
      if (isAborted(result)) {
        return
      }

      runInAction(() => {
        this._restoreError = getGraphQLErrorMessage(result.error)
      })
    }
  }

  public async applyRestore(): Promise<void> {
    const projectId = this.projectPermissions.projectId

    if (!projectId || !this.preview) {
      return
    }

    runInAction(() => {
      this._restoreError = null
    })

    const result = await this.applyRestoreRequest.fetch(projectId)

    if (!result.isRight) {
      if (isAborted(result)) {
        return
      }

      runInAction(() => {
        this._restoreError = getGraphQLErrorMessage(result.error)
      })

      return
    }

    runInAction(() => {
      this._restoreDialogOpen = false
      this._restoreError = null
    })

    toaster.success({
      description: 'Project file usage restored successfully',
    })

    await this.validate()
  }

  public init(): void {}

  public dispose(): void {
    this.disposer()
    this.validateRequest.abort()
    this.previewRestoreRequest.abort()
    this.applyRestoreRequest.abort()
  }
}

container.register(
  ProjectFileUsageViewModel,
  () => {
    const projectPermissions = container.get(ProjectPermissions)
    const permissionService = container.get(PermissionService)

    return new ProjectFileUsageViewModel(projectPermissions, permissionService)
  },
  { scope: 'request' },
)
