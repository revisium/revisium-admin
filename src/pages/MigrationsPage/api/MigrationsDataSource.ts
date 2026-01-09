import { makeAutoObservable, runInAction } from 'mobx'
import { MigrationData } from 'src/pages/MigrationsPage/config/types.ts'
import { container, isAborted, ObservableRequest } from 'src/shared/lib'
import { client } from 'src/shared/model/ApiService.ts'
import { ApplyMigrationStatus, MigrationBranchFragment } from 'src/__generated__/graphql-request'

export interface ApplyMigrationResult {
  id: string
  status: ApplyMigrationStatus
  error?: string | null
}

export interface BranchWithRevisions {
  id: string
  name: string
  isRoot: boolean
  headRevisionId: string
  draftRevisionId: string
}

export class MigrationsDataSource {
  private readonly getMigrationsRequest = ObservableRequest.of(client.getMigrations, {
    skipResetting: true,
  })
  private readonly getBranchesRequest = ObservableRequest.of(client.getMigrationBranches)
  private readonly getBranchMigrationsRequest = ObservableRequest.of(client.getBranchMigrations)
  private readonly applyMigrationsRequest = ObservableRequest.of(client.applyMigrations)

  private _wasAborted = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get isLoadingMigrations(): boolean {
    return this.getMigrationsRequest.isLoading
  }

  public get isLoadingBranches(): boolean {
    return this.getBranchesRequest.isLoading
  }

  public get isApplying(): boolean {
    return this.applyMigrationsRequest.isLoading
  }

  public get error(): string | null {
    return this.getMigrationsRequest.errorMessage ?? null
  }

  public get wasAborted(): boolean {
    return this._wasAborted
  }

  public async getMigrations(revisionId: string): Promise<MigrationData[] | null> {
    this._wasAborted = false

    const result = await this.getMigrationsRequest.fetch({
      data: { revisionId },
    })

    if (!result.isRight) {
      if (isAborted(result)) {
        runInAction(() => {
          this._wasAborted = true
        })
      }
      return null
    }

    return (result.data.revision.migrations as MigrationData[]) ?? []
  }

  public async getBranches(organizationId: string, projectName: string): Promise<BranchWithRevisions[] | null> {
    this._wasAborted = false

    const result = await this.getBranchesRequest.fetch({
      data: {
        organizationId,
        projectName,
        first: 100,
      },
    })

    if (!result.isRight) {
      if (isAborted(result)) {
        runInAction(() => {
          this._wasAborted = true
        })
      }
      return null
    }

    return result.data.branches.edges.map((edge): BranchWithRevisions => {
      const node: MigrationBranchFragment = edge.node
      return {
        id: node.id,
        name: node.name,
        isRoot: node.isRoot,
        headRevisionId: node.head.id,
        draftRevisionId: node.draft.id,
      }
    })
  }

  public async getBranchMigrations(revisionId: string): Promise<MigrationData[] | null> {
    const result = await this.getBranchMigrationsRequest.fetch({
      data: { revisionId },
    })

    if (!result.isRight) {
      return null
    }

    return (result.data.revision.migrations as MigrationData[]) ?? []
  }

  public async applyMigrations(
    revisionId: string,
    migrations: MigrationData[],
  ): Promise<ApplyMigrationResult[] | null> {
    const result = await this.applyMigrationsRequest.fetch({
      data: {
        revisionId,
        migrations,
      },
    })

    if (!result.isRight) {
      return null
    }

    return result.data.applyMigrations
  }

  public dispose(): void {
    this.getMigrationsRequest.abort()
    this.getBranchesRequest.abort()
    this.getBranchMigrationsRequest.abort()
    this.applyMigrationsRequest.abort()
  }
}

container.register(MigrationsDataSource, () => new MigrationsDataSource(), { scope: 'request' })
