import { makeAutoObservable, runInAction } from 'mobx'
import {
  CaslRuleInput,
  CreatePersonalApiKeyInput,
  CreateServiceApiKeyInput,
} from 'src/__generated__/graphql-request.ts'
import { ApiKeyModel } from 'src/entities/ApiKey'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, isAborted } from 'src/shared/lib'
import { ApiKeyManagerDataSource } from './ApiKeyManagerDataSource.ts'

export interface ApiKeyManagerConfig {
  mode: 'personal' | 'service'
  organizationId?: string
  defaultProjectId?: string
  defaultProjectName?: string
  filterByProjectId?: string
}

type PermissionPreset = 'read-only' | 'read-write' | 'full-access'

const PERMISSION_PRESETS: Record<PermissionPreset, CaslRuleInput[]> = {
  'read-only': [{ action: ['read'], subject: ['all'] }],
  'read-write': [{ action: ['read', 'create', 'update'], subject: ['all'] }],
  'full-access': [{ action: ['read', 'create', 'update', 'delete'], subject: ['all'] }],
}

export class ApiKeyManagerViewModel implements IViewModel {
  private _config: ApiKeyManagerConfig = { mode: 'personal' }
  private _items: ApiKeyModel[] = []
  private _isLoaded = false
  private _projectNames: Map<string, string> = new Map()

  private _isCreateDialogOpen = false
  private _isSecretDialogOpen = false
  private _isRevokeDialogOpen = false
  private _isRotateDialogOpen = false

  private _selectedKeyId: string | null = null
  private _lastSecret: string | null = null
  private _lastCreatedKeyName: string | null = null

  public createKeyName = ''
  public createKeyReadOnly = false
  public createKeyExpiresAt: string | null = null
  public createKeyExpirationPreset: string = 'none'
  public createKeyPermissionPreset: PermissionPreset = 'read-only'

  constructor(private readonly dataSource: ApiKeyManagerDataSource) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get mode(): 'personal' | 'service' {
    return this._config.mode
  }

  public get organizationId(): string | undefined {
    return this._config.organizationId
  }

  public get defaultProjectId(): string | undefined {
    return this._config.defaultProjectId
  }

  public get filterByProjectId(): string | undefined {
    return this._config.filterByProjectId
  }

  public get projectNames(): Map<string, string> {
    return this._projectNames
  }

  public resolveProjectName(projectId: string): string {
    return this._projectNames.get(projectId) ?? projectId
  }

  public get items(): ApiKeyModel[] {
    return this._items
  }

  public get filteredItems(): ApiKeyModel[] {
    if (!this._config.filterByProjectId) {
      return this._items
    }
    const projectId = this._config.filterByProjectId
    return this._items.filter((item) => item.projectIds.includes(projectId))
  }

  public get sortedItems(): ApiKeyModel[] {
    return [...this.filteredItems].sort((a, b) => {
      const statusOrder = { Active: 0, Expired: 1, Revoked: 2 }
      const statusDiff = statusOrder[a.statusLabel] - statusOrder[b.statusLabel]
      if (statusDiff !== 0) {
        return statusDiff
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  public get isLoading(): boolean {
    return this.dataSource.isLoading
  }

  public get isLoaded(): boolean {
    return this._isLoaded
  }

  public get isMutating(): boolean {
    return this.dataSource.isMutating
  }

  public get error(): string | null {
    return this.dataSource.error
  }

  public get isEmpty(): boolean {
    return this.filteredItems.length === 0
  }

  public get isCreateDialogOpen(): boolean {
    return this._isCreateDialogOpen
  }

  public get isSecretDialogOpen(): boolean {
    return this._isSecretDialogOpen
  }

  public get isRevokeDialogOpen(): boolean {
    return this._isRevokeDialogOpen
  }

  public get isRotateDialogOpen(): boolean {
    return this._isRotateDialogOpen
  }

  public get selectedKeyId(): string | null {
    return this._selectedKeyId
  }

  public get lastSecret(): string | null {
    return this._lastSecret
  }

  public get lastCreatedKeyName(): string | null {
    return this._lastCreatedKeyName
  }

  public get selectedKey(): ApiKeyModel | undefined {
    return this._items.find((item) => item.id === this._selectedKeyId)
  }

  public get canCreateKey(): boolean {
    return this.createKeyName.trim().length > 0 && !this.isMutating
  }

  public get emptyStateMessage(): string {
    if (this._config.mode === 'personal') {
      return 'No API keys yet. Create one for programmatic access to your data.'
    }
    return 'No integration keys for this organization.'
  }

  public configure(config: ApiKeyManagerConfig): void {
    this._config = config
  }

  public init(): void {}

  public dispose(): void {
    this.dataSource.dispose()
  }

  public reset(): void {
    this._items = []
    this._isLoaded = false
  }

  public async loadKeys(): Promise<void> {
    if (this._config.mode === 'personal') {
      const result = await this.dataSource.fetchPersonalKeys()

      if (!result.isRight) {
        if (isAborted(result)) {
          return
        }
        runInAction(() => {
          this._isLoaded = true
        })
        return
      }

      runInAction(() => {
        this._items = result.data.myApiKeys.filter((k) => k.type !== 'INTERNAL').map((k) => new ApiKeyModel(k))
        this._isLoaded = true
      })
    } else if (this._config.organizationId) {
      const [result, projectNames] = await Promise.all([
        this.dataSource.fetchServiceKeys(this._config.organizationId),
        this.dataSource.fetchProjectNames(this._config.organizationId),
      ])

      if (!result.isRight) {
        if (isAborted(result)) {
          return
        }
        runInAction(() => {
          this._isLoaded = true
        })
        return
      }

      runInAction(() => {
        this._projectNames = projectNames
        this._items = result.data.serviceApiKeys
          .filter((k) => k.type !== 'INTERNAL')
          .map((k) => {
            const model = new ApiKeyModel(k)
            model.setProjectNameResolver(this.resolveProjectName)
            return model
          })
        this._isLoaded = true
      })
    }
  }

  public openCreateDialog(): void {
    this._isCreateDialogOpen = true
    this.createKeyName = ''
    this.createKeyReadOnly = false
    this.createKeyExpiresAt = null
    this.createKeyExpirationPreset = 'none'
    this.createKeyPermissionPreset = 'read-only'
  }

  public closeCreateDialog(): void {
    this._isCreateDialogOpen = false
  }

  public setCreateKeyName(value: string): void {
    this.createKeyName = value
  }

  public setCreateKeyReadOnly(value: boolean): void {
    this.createKeyReadOnly = value
  }

  public setExpirationPreset(preset: string): void {
    this.createKeyExpirationPreset = preset
    const now = new Date()

    switch (preset) {
      case '30d':
        now.setDate(now.getDate() + 30)
        this.createKeyExpiresAt = now.toISOString()
        break
      case '60d':
        now.setDate(now.getDate() + 60)
        this.createKeyExpiresAt = now.toISOString()
        break
      case '90d':
        now.setDate(now.getDate() + 90)
        this.createKeyExpiresAt = now.toISOString()
        break
      case '1y':
        now.setFullYear(now.getFullYear() + 1)
        this.createKeyExpiresAt = now.toISOString()
        break
      case 'none':
        this.createKeyExpiresAt = null
        break
    }
  }

  public setPermissionPreset(preset: PermissionPreset): void {
    this.createKeyPermissionPreset = preset
  }

  public async createKey(): Promise<void> {
    if (!this.canCreateKey) {
      return
    }

    if (this._config.mode === 'personal') {
      const input: CreatePersonalApiKeyInput = {
        name: this.createKeyName.trim(),
        readOnly: this.createKeyReadOnly,
        expiresAt: this.createKeyExpiresAt ?? undefined,
        projectIds: this._config.defaultProjectId ? [this._config.defaultProjectId] : undefined,
      }

      const result = await this.dataSource.createPersonalKey(input)
      if (result) {
        runInAction(() => {
          this._lastSecret = result.secret
          this._lastCreatedKeyName = result.apiKey.name
          this._isCreateDialogOpen = false
          this._isSecretDialogOpen = true
        })
        await this.loadKeys()
      }
    } else if (this._config.organizationId) {
      const input: CreateServiceApiKeyInput = {
        name: this.createKeyName.trim(),
        organizationId: this._config.organizationId,
        readOnly: this.createKeyReadOnly,
        expiresAt: this.createKeyExpiresAt ?? undefined,
        projectIds: this._config.defaultProjectId ? [this._config.defaultProjectId] : undefined,
        permissions: {
          rules: PERMISSION_PRESETS[this.createKeyPermissionPreset],
        },
      }

      const result = await this.dataSource.createServiceKey(input)
      if (result) {
        runInAction(() => {
          this._lastSecret = result.secret
          this._lastCreatedKeyName = result.apiKey.name
          this._isCreateDialogOpen = false
          this._isSecretDialogOpen = true
        })
        await this.loadKeys()
      }
    }
  }

  public closeSecretDialog(): void {
    this._isSecretDialogOpen = false
    this._lastSecret = null
    this._lastCreatedKeyName = null
  }

  public openRevokeDialog(keyId: string): void {
    this._selectedKeyId = keyId
    this._isRevokeDialogOpen = true
  }

  public closeRevokeDialog(): void {
    this._isRevokeDialogOpen = false
    this._selectedKeyId = null
  }

  public async revokeKey(): Promise<void> {
    if (!this._selectedKeyId) {
      return
    }

    const result = await this.dataSource.revokeKey(this._selectedKeyId)

    if (result) {
      runInAction(() => {
        this._isRevokeDialogOpen = false
        this._selectedKeyId = null
      })
      await this.loadKeys()
    }
  }

  public openRotateDialog(keyId: string): void {
    this._selectedKeyId = keyId
    this._isRotateDialogOpen = true
  }

  public closeRotateDialog(): void {
    this._isRotateDialogOpen = false
    this._selectedKeyId = null
  }

  public async rotateKey(): Promise<void> {
    if (!this._selectedKeyId) {
      return
    }

    const result = await this.dataSource.rotateKey(this._selectedKeyId)

    if (result) {
      runInAction(() => {
        this._lastSecret = result.secret
        this._lastCreatedKeyName = result.apiKey.name
        this._isRotateDialogOpen = false
        this._selectedKeyId = null
        this._isSecretDialogOpen = true
      })
      await this.loadKeys()
    }
  }
}

container.register(
  ApiKeyManagerViewModel,
  () => {
    const dataSource = container.get(ApiKeyManagerDataSource)
    return new ApiKeyManagerViewModel(dataSource)
  },
  { scope: 'request' },
)
