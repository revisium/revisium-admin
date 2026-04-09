import { makeAutoObservable, runInAction } from 'mobx'
import { AdminCacheStatsQuery } from 'src/__generated__/graphql-request'
import { IViewModel } from 'src/shared/config/types'
import { container } from 'src/shared/lib'
import { ObservableRequest } from 'src/shared/lib/ObservableRequest'
import { client } from 'src/shared/model/ApiService'
import { ConfigurationService } from 'src/shared/model/ConfigurationService'

type CacheMetric = NonNullable<AdminCacheStatsQuery['adminCacheStats']>['byCategory'][number]

export class AdminCacheViewModel implements IViewModel {
  private readonly statsRequest = ObservableRequest.of(client.adminCacheStats)
  private readonly resetRequest = ObservableRequest.of(client.adminResetAllCache)
  private readonly configurationService: ConfigurationService
  private _resetSuccess: boolean = false
  private _showConfirm: boolean = false

  constructor(configurationService: ConfigurationService) {
    this.configurationService = configurationService
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get cacheEnabled(): boolean {
    return this.configurationService.cacheEnabled
  }

  public get isLoading(): boolean {
    return this.statsRequest.isLoading
  }

  public get isResetting(): boolean {
    return this.resetRequest.isLoading
  }

  public get resetSuccess(): boolean {
    return this._resetSuccess
  }

  public get showConfirm(): boolean {
    return this._showConfirm
  }

  public get totalHits(): number {
    return this.statsRequest.data?.adminCacheStats.totalHits ?? 0
  }

  public get totalMisses(): number {
    return this.statsRequest.data?.adminCacheStats.totalMisses ?? 0
  }

  public get totalWrites(): number {
    return this.statsRequest.data?.adminCacheStats.totalWrites ?? 0
  }

  public get totalDeletes(): number {
    return this.statsRequest.data?.adminCacheStats.totalDeletes ?? 0
  }

  public get totalClears(): number {
    return this.statsRequest.data?.adminCacheStats.totalClears ?? 0
  }

  public get overallHitRate(): number {
    return this.statsRequest.data?.adminCacheStats.overallHitRate ?? 0
  }

  public get byCategory(): CacheMetric[] {
    return this.statsRequest.data?.adminCacheStats.byCategory ?? []
  }

  public get resetError(): string | null {
    return this.resetRequest.errorMessage ?? null
  }

  public openConfirm(): void {
    this._showConfirm = true
    this._resetSuccess = false
  }

  public closeConfirm(): void {
    this._showConfirm = false
  }

  public async confirmReset(): Promise<void> {
    this._showConfirm = false

    const result = await this.resetRequest.fetch({})

    if (result.isRight) {
      runInAction(() => {
        this._resetSuccess = true
      })
      void this.statsRequest.fetch({})
    }
  }

  public init(): void {
    if (this.cacheEnabled) {
      void this.statsRequest.fetch({})
    }
  }

  public dispose(): void {
    this.statsRequest.abort()
    this.resetRequest.abort()
  }
}

container.register(
  AdminCacheViewModel,
  () => {
    const configurationService = container.get(ConfigurationService)
    return new AdminCacheViewModel(configurationService)
  },
  { scope: 'request' },
)
